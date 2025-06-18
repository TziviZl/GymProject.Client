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

  useEffect(() => {
    if (!gymnastId) {
      navigate('/Login');
      return;
    }
    getGymnastById(gymnastId)
      .then((res) => {
        setUser(res.data);
        setEditedUser(res.data);
      })
      .catch(() => setMessage("We were unable to load your profile."))
      .finally(() => setLoading(false));
  }, [gymnastId, navigate]);

  useEffect(() => {
    if (!gymnastId) return;
    getGymnastLessons(gymnastId, 10)
      .then((res) => setLessons(res.data))
      .catch(() => setMessage("Failed to load lessons."));
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
      setMessage("Details updated successfully.");
      setEditing(false);
    } catch (error: any) {
      setMessage("Failed to save changes.");
      console.error("Error updating user:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  const handleCancelLesson = async (classId: number) => {
    if (!gymnastId) return;
    if (!window.confirm("Are you sure you want to cancel your registration for this class?")) return;
    try {
      await removeGymnastFromClass(gymnastId, classId);
      setLessons((prev) => prev.filter(l => l.id !== classId));
    } catch {
      alert("Failed to cancel class.");
    }
  };

  const handleDeleteProfile = async () => {
    if (!gymnastId) return;
    const confirmed = window.confirm("Are you sure you want to DELETE your profile? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteGymnast(gymnastId);
      alert("Your profile has been deleted.");
      navigate("/Login");
    } catch (error) {
      alert("Failed to delete profile. Please try again later.");
      console.error("Delete error:", error);
    }
  };

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (!user || !editedUser) return <div className="profile-container">User not found</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {message && <div className="error">{message}</div>}

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
    </div>
  );
}
