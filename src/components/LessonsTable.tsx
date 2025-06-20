import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLessons, MViewStudioClasses, isFull } from "../api/classApi";
import { addGymnastLesson } from "../api/gymnastApi";
import "../css/LessonsTable.css";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getUpcomingWeekDates(): Record<string, string> {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay()); 

  const dates: Record<string, string> = {};
  for (let i = 0; i < 6; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    dates[daysOfWeek[i]] = day.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
    });
  }
  return dates;
}

export default function LessonsTable() {
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [fullStatus, setFullStatus] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [isFullLoading, setIsFullLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const weekDates = getUpcomingWeekDates();

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = await getAllLessons();
        setLessons(res.data);
        setError(null);

        const statuses: Record<number, boolean> = {};
        await Promise.all(
          res.data.map(async (lesson: MViewStudioClasses) => {
            const response = await isFull(lesson.id);
            statuses[lesson.id] = response.data;
          })
        );
        setFullStatus(statuses);
        setIsFullLoading(false);
      } catch (err) {
        console.error("Error loading lessons:", err);
        setError("Error loading lessons");
        setIsFullLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleJoinLesson = async (lesson: MViewStudioClasses) => {
    const gymnastId = localStorage.getItem("gymnastId");
    if (!gymnastId) {
      alert("You must log in before registering for a lesson");
      navigate("/Login");
      return;
    }

    const full = await isFull(lesson.id);
    if (full.data) {
      alert("This class is already full.");
      return;
    }

    try {
      await addGymnastLesson(gymnastId, lesson.id);
      alert("You have registered successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data || "Error registering for class");
    }
  };

  if (loading || isFullLoading) return <div>Loading lessons...</div>;
  if (error) return <div>{error}</div>;

  const lessonsByDay = lessons.reduce((acc, lesson) => {
    const dayIndex = new Date(lesson.date).getDay();
    const dayName = daysOfWeek[dayIndex];
    if (!acc[dayName]) acc[dayName] = [];
    acc[dayName].push(lesson);
    return acc;
  }, {} as Record<string, MViewStudioClasses[]>);

  return (
    <div className="lessons-container">
      <h2 className="lessons-title">Studio Lesson Schedule</h2>

      <div className="lessons-list">
        {daysOfWeek.map((day) => (
          <div className="lesson-column" key={day}>
            <h3>
              {day} ({weekDates[day]})
            </h3>
            {lessonsByDay[day]?.length ? (
              lessonsByDay[day].map((lesson, idx) => {
                const isLessonInPast =
                  new Date(lesson.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
                const isLessonFull = fullStatus[lesson.id];
                const disabled = isLessonInPast || isLessonFull;

                const buttonText = isLessonInPast
                  ? "Class Passed"
                  : isLessonFull
                  ? "Full"
                  : "Join";

                return (
                  <div className="lesson-card" key={idx}>
                    <h3>{lesson.name}</h3>
                    <p>Level: {lesson.level}</p>
                    <p>
                      Time:{" "}
                      {new Date(lesson.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <p>Trainer: {lesson.trainerName || "Not Specified"}</p>
                    <button
                      onClick={() => handleJoinLesson(lesson)}
                      disabled={disabled}
                      style={{
                        backgroundColor: disabled ? "#ccc" : "#ffa726",
                        cursor: disabled ? "not-allowed" : "pointer",
                        color: "white",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                        marginTop: "10px",
                      }}
                    >
                      {buttonText}
                    </button>
                  </div>
                );
              })
            ) : (
              <p style={{ opacity: 0.6 }}>No lessons</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
