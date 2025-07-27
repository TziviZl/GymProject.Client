import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGymnastById,
  updateGymnast,
  deleteGymnast,
  getGymnastLessons,
  removeGymnastFromClass,
} from '../../api/gymnastApi';
import { MGymnast, MViewStudioClasses } from '../../types';
import { isCancelled } from '../../api/classApi';
import { useAuth } from '../../store/hooks';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ToastMessage from '../../components/shared/ToastMessage';
import '../../css/MyProfile.css';
import Loader from '../../components/shared/Loader';

export default function MyProfile() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<MGymnast | null>(null);
  const [editedUser, setEditedUser] = useState<MGymnast | null>(null);
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [cancelledStatus, setCancelledStatus] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { message, messageType, showMessage, showError, handleError } = useErrorHandler();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmCancelClassId, setConfirmCancelClassId] = useState<number | null>(null);



  useEffect(() => {
    if (!userId) {
      navigate('/Login');
      return;
    }

    const fetchProfileAndLessons = async () => {
      try {
        const userRes = await getGymnastById(userId);
        setUser(userRes.data);
        setEditedUser(userRes.data);

        const lessonsRes = await getGymnastLessons(userId, 10);
        setLessons(lessonsRes.data);

        const cancelledMap: Record<number, boolean> = {};
        await Promise.all(
          lessonsRes.data.map(async (lesson) => {
            try {
              const res = await isCancelled(lesson.id);
              cancelledMap[lesson.id] = res.data;
            } catch {
              cancelledMap[lesson.id] = false;
            }
          })
        );
        setCancelledStatus(cancelledMap);
      } catch (err) {
        showMessage("Failed to load profile or lessons.", 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndLessons();
  }, [userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    if (!editedUser) return;

    // Phone validation
    if (editedUser.cell.length < 9 || editedUser.cell.length > 10 || !/^\d+$/.test(editedUser.cell)) {
      showMessage('Phone number must be 9-10 digits', 'error');
      return;
    }

    try {
      const { memberShipType, weeklyCounter, ...dataToUpdate } = editedUser as any;
      const res = await updateGymnast(dataToUpdate);
      setUser(res.data);
      showMessage("Details updated successfully.", 'success');
      setEditing(false);
    } catch (error: any) {
      showMessage("Failed to save changes.", 'error');
    }
  };

  const handleCancelLesson = (classId: number) => {
    setConfirmCancelClassId(classId);
  };

  const confirmCancelYes = async () => {
    if (!userId || confirmCancelClassId === null) return;
    try {
      await removeGymnastFromClass(userId, confirmCancelClassId);
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

  const handleDeleteProfile = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteYes = async () => {
    setConfirmDelete(false);
    if (!userId) return;
    try {
      await deleteGymnast(userId);
      showMessage("Your profile has been deleted.", 'success');
      setTimeout(() => navigate("/Login"), 1500);
    } catch (error) {
      showMessage("Failed to delete profile. Please try again later.", 'error');
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDelete(false);
  };

if (loading) return <Loader />;
  if (!user || !editedUser) return <div className="profile-container">User not found</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {message && <ToastMessage message={message} type={messageType} />}

      {/* Personal details form */}
      <label>First Name: <input name="firstName" value={editedUser.firstName} onChange={handleChange} disabled={!editing} /></label>
      <label>Last Name: <input name="lastName" value={editedUser.lastName} onChange={handleChange} disabled={!editing} /></label>
      <label>Email: <input name="email" value={editedUser.email} onChange={handleChange} disabled={!editing} /></label>
      <label>Phone: <input name="cell" value={editedUser.cell} onChange={handleChange} disabled={!editing} /></label>
      <label>Date of Birth: <input type="date" name="birthDate" value={editedUser.birthDate?.slice(0, 10) || ''} onChange={handleChange} disabled={!editing} /></label>
      <label>Medical Insurance: <input name="medicalInsurance" value={editedUser.medicalInsurance} onChange={handleChange} disabled={!editing} /></label>

      {!editing ? (
        <>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDeleteProfile} className="delete-btn">Delete</button>
        </>
      ) : (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => { setEditedUser(user); setEditing(false); }}>Cancel</button>
        </>
      )}

      <hr />

      {/* Lessons list */}
      <h2>My Lessons</h2>
      {lessons.length === 0 ? (
        <p>You are not enrolled in any lessons yet.</p>
      ) : (
        <ul className="lessons-list">
          {lessons.map(lesson => (
            <li key={lesson.id}>
              <div>
                <strong>{lesson.name}</strong><br />
                Trainer: {lesson.trainerName} | Level: {lesson.level}
              </div>
              {cancelledStatus[lesson.id] ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>Cancelled by trainer</span>
              ) : (
                <button onClick={() => handleCancelLesson(lesson.id)}>Cancel</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation dialogs */}
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
