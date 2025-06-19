import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLessons, MViewStudioClasses, isFull } from "../api/classApi";
import { addGymnastLesson } from "../api/gymnastApi";
import ToastMessage from "./shared/ToastMessage";
import "../css/LessonsTable.css";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getUpcomingWeekDates(): Record<string, string> {
  const today = new Date();

  const isSaturdayAfter8pm =
    today.getDay() === 6 && today.getHours() >= 20;

  const baseDate = new Date(today);

  if (isSaturdayAfter8pm) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  const sunday = new Date(baseDate);
  sunday.setDate(sunday.getDate() - sunday.getDay());

  const dates: Record<string, string> = {};
  for (let i = 0; i < 6; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    dates[daysOfWeek[i]] = day.toLocaleDateString("en-GB", {
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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
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

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3800);
  };

  const handleJoinLesson = async (lesson: MViewStudioClasses) => {
    const gymnastId = localStorage.getItem("gymnastId");
    if (!gymnastId) {
      showMessage("You must log in before registering for a lesson", "error");
      navigate("/Login");
      return;
    }

    const full = await isFull(lesson.id);
    if (full.data) {
      showMessage("This class is already full", "error");
      return;
    }

    try {
      await addGymnastLesson(gymnastId, lesson.id);
      showMessage("Successfully registered for the lesson!", "success");
    } catch (err: any) {
      console.error(err);
      showMessage(err?.response?.data || "Error registering for class", "error");
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
                const lessonDateTime = new Date(lesson.date);
                const now = new Date();
                const isLessonInPast = lessonDateTime < now;
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
                      {lessonDateTime.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <p>Trainer: {lesson.trainerName || "Not Specified"}</p>
                    <button
                      onClick={() => handleJoinLesson(lesson)}
                      disabled={disabled}
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

      {message && <ToastMessage message={message} type={messageType} />}
    </div>
  );
}
