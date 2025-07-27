import React, { useEffect, useState } from "react";
import {
  getAllLessons,
  cancelClass,
  MViewStudioClasses,
} from "../../../api/classApi";
import "../../../css/SecretaryClasses.css";
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

        const allLessons = res.data;
        allLessons.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setWeeklyLessons(allLessons);
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

  if (loading) return <div className="contact-container">Loading classes...</div>;
  if (error) return <div className="contact-container error">{error}</div>;

  return (
    <div className="contact-container">
      <h1>All Classes</h1>

      {confirmCancelId !== null && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to cancel this lesson? This action cannot be undone.</p>
          <button onClick={confirmCancelYes}>Yes, cancel</button>
          <button onClick={confirmCancelNo}>Cancel</button>
        </div>
      )}

      {weeklyLessons.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <div className="class-list">
          {weeklyLessons.map((lesson) => {
            const isPast = new Date(lesson.date) < new Date();
            const isCancelled = (lesson as any).isCancelled;

            return (
              <div
                className={`class-card ${isPast ? "past" : ""} ${isCancelled ? "cancelled" : ""}`}
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
                    🗑 DELETE
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
