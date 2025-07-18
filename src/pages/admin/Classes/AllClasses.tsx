import React, { useEffect, useState } from "react";
import {
  getAllLessons,
  cancelClass,
  MViewStudioClasses,
} from "../../../api/classApi";
import "../../../css/SecretaryLessons.css";
import ToastMessage from "../../../components/shared/ToastMessage";

export default function SecretaryLessons() {
  const [weeklyLessons, setWeeklyLessons] = useState<MViewStudioClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWeeklyLessons = async () => {
      setLoading(true);
      try {
        const res = await getAllLessons();

        const today = new Date();
        const sundayIndex = today.getDay() === 0 ? -6 : 1 - today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + sundayIndex);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const now = new Date(); 


        const filtered = res.data.filter((lesson) => {
          const lessonDate = new Date(lesson.date);
          return lessonDate >= startOfWeek && lessonDate <= endOfWeek && lessonDate > now;
        });

        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setWeeklyLessons(filtered);
        setError(null);
      } catch (err) {
        console.error("Error loading lessons:", err);
        setError("Error loading lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyLessons();
  }, []);

  const now = new Date();


  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleCancel = (id: number) => {
    setConfirmCancelId(id);
  };

  const confirmCancelYes = async () => {
    if (!confirmCancelId) return;

    try {
      await cancelClass(confirmCancelId);
      setWeeklyLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === confirmCancelId
            ? { ...lesson, isCancelled: true }
            : lesson
        )
      );
      setMessage("Lesson was successfully cancelled.");
      setMessageType("success");
    } catch (err) {
      console.error("Error cancelling lesson:", err);
      setMessage("An error occurred while cancelling the lesson.");
      setMessageType("error");
    } finally {
      setConfirmCancelId(null);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const confirmCancelNo = () => {
    setConfirmCancelId(null);
  };

  if (loading) return <div className="contact-container">Loading lessons...</div>;
  if (error) return <div className="contact-container error">{error}</div>;

  return (
    <div className="contact-container">
      <h1>This Week's Lessons</h1>

      {confirmCancelId !== null && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to cancel this lesson? This action cannot be undone.</p>
          <button onClick={confirmCancelYes}>Yes, cancel</button>
          <button onClick={confirmCancelNo}>Cancel</button>
        </div>
      )}

      {weeklyLessons.length === 0 ? (
        <p>No lessons found for this week.</p>
      ) : (
        <div className="lesson-list">
          {weeklyLessons.map((lesson) => {
            const isPast = new Date(lesson.date) < new Date();
            const isCancelled = (lesson as any).isCancelled;

            return (
              <div
                className={`lesson-card ${isPast ? "past" : ""} ${isCancelled ? "cancelled" : ""}`}
                key={lesson.id}
              >
                <div>
                  <strong>{lesson.name}</strong> | Level: {lesson.level} <br />
                  {formatDateTime(lesson.date)} <br />
                  <small>Trainer: {lesson.trainerName}</small><br />
                  <small>Registered: {20-lesson.currentNum}</small><br />
                  {isCancelled && <div className="cancel-label">Cancelled</div>}
                </div>

                {!isCancelled && (
                  <button onClick={(e) => { e.stopPropagation(); handleCancel(lesson.id); }}>
                    ❌ Cancel Lesson
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {message && <ToastMessage message={message} type={messageType} />}
    </div>
  );
}
