import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTrainerById,
  getTrainerStudioClasses,
  updateTrainer,
  deleteTrainer,
} from '../../api/trainerApi';
import { MTrainer, MViewStudioClasses } from '../../types';
import { useAuth,AuthProvider } from '../../context/AuthContext';
import ToastMessage from '../../components/shared/ToastMessage';
import { cancelClass, isCancelled } from '../../api/classApi';
import '../../css/MyProfile.css';


export default function TrainerProfile() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<MTrainer | null>(null);
  const [editedTrainer, setEditedTrainer] = useState<MTrainer | null>(null);
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { logout } = useAuth();

  // מצב ביטול שיעורים לפי ID
  const [cancelledStatus, setCancelledStatus] = useState<Record<number, boolean>>({});

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    if (!userId) {
      navigate('/Login');
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [trainerRes, classesRes] = await Promise.all([
          getTrainerById(userId as string),
          getTrainerStudioClasses(userId as string),
        ]);

        setTrainer(trainerRes.data);
        setEditedTrainer(trainerRes.data);
        setLessons(classesRes.data);
      } catch {
        showMessage("Failed to load trainer data.", 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId, navigate]);

  // טוען את מצב הביטול מחדש בכל פעם ש-lessons משתנה
  useEffect(() => {
    if (lessons.length === 0) return;

    async function fetchCancelledStatus() {
      const statusMap: Record<number, boolean> = {};
      await Promise.all(
        lessons.map(async (lesson) => {
          try {
            const res = await isCancelled(lesson.id);
            statusMap[lesson.id] = res.data;
          } catch {
            statusMap[lesson.id] = false;
          }
        })
      );
      setCancelledStatus(statusMap);
    }

    fetchCancelledStatus();
  }, [lessons]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedTrainer) return;
    const { name, value } = e.target;
    setEditedTrainer({ ...editedTrainer, [name]: value });
  };

  const handleSave = async () => {
    if (!editedTrainer) return;

    // ולידציה לטלפון
    if (editedTrainer.cell.length < 9 || editedTrainer.cell.length > 10 || !/^\d+$/.test(editedTrainer.cell)) {
      showMessage('Phone number must be 9-10 digits', 'error');
      return;
    }

    try {
      const res = await updateTrainer(editedTrainer);
      setTrainer(res.data);
      showMessage("Details updated successfully.", 'success');
      setEditing(false);
    } catch (error) {
      showMessage("Failed to save changes.", 'error');
      console.error("Error updating trainer:", error);
    }
  };

  const handleDeleteProfile = () => {
    setConfirmDelete(true);
  };

const confirmDeleteYes = async () => {
  setConfirmDelete(false);
  if (!userId) return;

  try {
    await deleteTrainer(userId);
    showMessage("Your profile has been deleted.", 'success');

    setTimeout(() => {
      navigate("/Login");
      setTimeout(() => logout(), 200); 
    }, 1000);

  } catch (error) {
    showMessage("Failed to delete profile. Please try again later.", 'error');
    console.error("Delete error:", error);
  }
};
  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  const handleCancelLesson = async (lessonId: number) => {
    try {
      await cancelClass(lessonId);
      showMessage("Lesson cancelled successfully", "success");

      // עדכון מצב הביטול לשיעור הזה
      setCancelledStatus(prev => ({ ...prev, [lessonId]: true }));
    } catch (error) {
      showMessage("Failed to cancel lesson", "error");
      console.error("Cancel lesson error:", error);
    }
  };

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (!trainer || !editedTrainer) return <div className="profile-container">Trainer not found</div>;

  return (
    <div className="profile-container">
      <h1>Trainer Profile</h1>

      {message && <ToastMessage message={message} type={messageType} />}

      <label>
        First Name:
        <input name="firstName" value={editedTrainer.firstName} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Last Name:
        <input name="lastName" value={editedTrainer.lastName} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Email:
        <input name="email" value={editedTrainer.email} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Phone:
        <input name="cell" value={editedTrainer.cell} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="birthDate"
          value={editedTrainer.birthDate?.slice(0, 10) || ''}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <label>
        Specialization:
        <input name="specialization" value={editedTrainer.specialization} onChange={handleChange} disabled={!editing} />
      </label>

      {!editing ? (
        <>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDeleteProfile} className="delete-btn" title="Delete your profile permanently">
            Delete
          </button>
        </>
      ) : (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => { setEditedTrainer(trainer); setEditing(false); }}>Cancel</button>
        </>
      )}

      <hr />

      <h2>My Weekly Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons assigned yet.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => {
            const isCancelled = cancelledStatus[lesson.id];
            const isPast = new Date(lesson.date) < new Date();
            return (  
              <li key={lesson.id}>
  <strong>{lesson.name}</strong> | Level: {lesson.level} | Date: {new Date(lesson.date).toLocaleDateString()} {new Date(lesson.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isCancelled ? (
  <span style={{ color: 'gray', marginLeft: '10px' }}>
                  (Cancelled)
                </span>
              ) : isPast ? (
                <span style={{ color: 'gray', marginLeft: '10px' }}>(Lesson Passed)</span>
              ) : (
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleCancelLesson(lesson.id)}
                >
                  Cancel
                </button>
              )}

              </li>
            );
          })}
        </ul>
      )}
      

      {confirmDelete && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to DELETE your profile? This action cannot be undone.</p>
          <button onClick={confirmDeleteYes}>Yes</button>
          <button onClick={confirmDeleteNo}>No</button>
        </div>
      )}
    </div>
  );
}
