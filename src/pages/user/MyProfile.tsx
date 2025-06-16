import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGymnastById, MGymnast } from '../../api/gymnastApi';
import { getGymnastLessons, MViewStudioClasses ,removeGymnastFromClass} from '../../api/gymnastApi'; 
import { useAuth } from '../../context/AuthContext';

export default function MyProfile() {
  const { gymnastId } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<MGymnast | null>(null);
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorLessons, setErrorLessons] = useState<string | null>(null);


  async function handleCancel(classId: number) {
  if (!gymnastId) return;
if (!window.confirm("Are you sure you want to cancel your registration for this class?")) return;
  try {
    await removeGymnastFromClass(gymnastId, classId);
    setLessons((prev) => prev.filter(l => l.id !== classId));
  } catch (err) {
console.error("Error canceling class:", err);
alert("An error occurred while canceling the registration. Please try again.");
  }
}

  useEffect(() => {
    if (!gymnastId) {
      navigate('/Login');
      return;
    }

    // טוען את פרטי המשתמש
    getGymnastById(gymnastId)
      .then((res) => setUser(res.data))
      .catch((err) => {
console.error("Error loading user:", err);
setError("We were unable to load the user. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [gymnastId, navigate]);

  useEffect(() => {
    if (!gymnastId) return;

    // טוען את השיעורים של המתאמן, נניח 10 שיעורים אחרונים
    getGymnastLessons(gymnastId, 10)
      .then((res) => setLessons(res.data))
      .catch((err) => {
console.error("Error loading lessons:", err);
setErrorLessons("We were unable to load the lessons. Please try again.");
      })
      .finally(() => setLoadingLessons(false));
  }, [gymnastId]);

if (loading) return <div>Loading user details...</div>;
if (error) return <div style={{ color: 'red' }}>{error}</div>;
if (!user) return <div>No user details found</div>;
  return (
    <div>
<h1>Hello, {user.firstName || user.id}</h1>
<p>ID: {user.id}</p>
<p>Email: {user.email}</p>
<p>Phone: {user.cell}</p>
<p>Last Name: {user.lastName}</p>
<p>First Name: {user.firstName}</p>
<p>Date of Birth: {new Date(user.birthDate).toLocaleDateString("he-IL")}</p>
<p>Medical Insurance: {user.medicalInsurance}</p>
      <hr />

<h2>My Lessons</h2>
{loadingLessons && <div>Loading lessons...</div>}
{errorLessons && <div style={{ color: 'red' }}>{errorLessons}</div>}
{!loadingLessons && lessons.length === 0 && <div>You are not enrolled in lessons yet.</div>}
<ul>
{lessons.map((lesson) => ( 
<li key={lesson.id}> 
<strong>{lesson.name}</strong> - Trainer: {lesson.trainerName}, Level: {lesson.level}
<button 
onClick={() => handleCancel(lesson.id)} 
className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
> 
cancellation
</button> </li> 
))}
</ul> 
</div> 
);
}