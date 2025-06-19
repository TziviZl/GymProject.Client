import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGymnastById,
  updateGymnast,
  deleteGymnast,
  MGymnast,
  getGymnastLessons,
  MViewStudioClasses,
  removeGymnastFromClass,
} from '../../api/gymnastApi';
import { useAuth } from '../../context/AuthContext';
import ToastMessage from '../../components/shared/ToastMessage'; 
import '../../css/MyProfile.css';

export default function MyProfile() {
  const { gymnastId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<MGymnast | null>(null);
  const [editedUser, setEditedUser] = useState<MGymnast | null>(null);
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmCancelClassId, setConfirmCancelClassId] = useState<number | null>(null);

  // פונקציה להציג הודעה עם toast
  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    if (!gymnastId) {
      navigate('/Login');
      return;
    }
    getGymnastById(gymnastId)
      .then(res => {
        setUser(res.data);
        setEditedUser(res.data);
      })
      .catch(() => showMessage("We were unable to load your profile.", 'error'))
      .finally(() => setLoading(false));
  }, [gymnastId, navigate]);

  useEffect(() => {
    if (!gymnastId) return;
    getGymnastLessons(gymnastId, 10)
      .then(res => setLessons(res.data))
      .catch(() => showMessage("Failed to load lessons.", 'error'));
  }, [gymnastId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      const { memberShipType, weeklyCounter, ...dataToUpdate } = editedUser as any;

      const res = await updateGymnast(dataToUpdate);
      setUser(res.data);
      showMessage("Details updated successfully.", 'success');
      setEditing(false);
    } catch (error: any) {
      showMessage("Failed to save changes.", 'error');
      console.error("Error updating user:", error);
    }
  };

const handleCancelLesson = (classId: number) => {
  setConfirmCancelClassId(classId);
};

const confirmCancelYes = async () => {
  if (!gymnastId || confirmCancelClassId === null) return;

  try {
    await removeGymnastFromClass(gymnastId, confirmCancelClassId);
    setLessons(prev => prev.filter(l => l.id !== confirmCancelClassId));
    showMessage("Class cancelled successfully.", 'success');
  } catch {
    showMessage("Failed to cancel class.", 'error');
  } finally {
    setConfirmCancelClassId(null);
  }
};

const confirmCancelNo = () => {
  setConfirmCancelClassId(null);
};

  // הפעלה של תיבת אישור מחיקה מותאמת
  const handleDeleteProfile = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    setConfirmDelete(false);
    if (!gymnastId) return;

    try {
      await deleteGymnast(gymnastId);
      showMessage("Your profile has been deleted.", 'success');
      setTimeout(() => navigate("/Login"), 1500);
    } catch (error) {
      showMessage("Failed to delete profile. Please try again later.", 'error');
      console.error("Delete error:", error);
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (!user || !editedUser) return <div className="profile-container">User not found</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {/* הצגת ה־Toast */}
      {message && <ToastMessage message={message} type={messageType} />}

      <label>
        First Name:
        <input name="firstName" value={editedUser.firstName} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Last Name:
        <input name="lastName" value={editedUser.lastName} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Email:
        <input name="email" value={editedUser.email} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Phone:
        <input name="cell" value={editedUser.cell} onChange={handleChange} disabled={!editing} />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="birthDate"
          value={editedUser.birthDate?.slice(0, 10) || ''}
          onChange={handleChange}
          disabled={!editing}
        />
      </label>

      <label>
        Medical Insurance:
        <input name="medicalInsurance" value={editedUser.medicalInsurance} onChange={handleChange} disabled={!editing} />
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
          <button onClick={() => { setEditedUser(user); setEditing(false); }}>Cancel</button>
        </>
      )}

      <hr />

      <h2>My Lessons</h2>
      {lessons.length === 0 ? (
        <p>You are not enrolled in any lessons yet.</p>
      ) : (
        <ul>
          {lessons.map(lesson => (
            <li key={lesson.id}>
              <div>
                <strong>{lesson.name}</strong><br />
                Trainer: {lesson.trainerName} | Level: {lesson.level}
              </div>
              <button onClick={() => handleCancelLesson(lesson.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}

      {confirmDelete && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to DELETE your profile? This action cannot be undone.</p>
          <button onClick={confirmDeleteYes}>Yes</button>
          <button onClick={confirmDeleteNo}>No</button>
        </div>
      )}

      {confirmCancelClassId !== null && (
  <div className="confirm-delete-toast">
    <p>Are you sure you want to cancel your registration for this class?</p>
    <button onClick={confirmCancelYes}>Yes</button>
    <button onClick={confirmCancelNo}>No</button>
  </div>
)}

    </div>
  );
}
