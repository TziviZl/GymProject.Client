import React, { useEffect, useState } from "react";
import { getAllGymnasts, deleteGymnast, MViewGymnastBL } from "../../../api/gymnastApi";
import ToastMessage from "../../../components/shared/ToastMessage";
import "../../../css/SecretaryGymnast.css";

export default function SecretaryGymnasts() {
  const [gymnasts, setGymnasts] = useState<MViewGymnastBL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchGymnasts = async () => {
    setLoading(true);
    try {
      const res = await getAllGymnasts();
      console.log("Gymnasts fetched:", res.data);
      setGymnasts(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load gymnasts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGymnasts();
  }, []);

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // במקום window.confirm - פתיחת חלון אישור
  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  // אישור מחיקה
  const confirmDeleteYes = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteGymnast(confirmDeleteId);
      showMessage("Gymnast deleted successfully", "success");
      fetchGymnasts();
    } catch (err) {
      showMessage("Failed to delete gymnast", "error");
      console.error(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  // ביטול מחיקה
  const confirmDeleteNo = () => {
    setConfirmDeleteId(null);
  };

  if (loading) return <div className="contact-container">Loading gymnasts...</div>;
  if (error) return <div className="contact-container error">{error}</div>;

  return (
    <div className="contact-container">
      <h1>All Gymnasts</h1>
      {gymnasts.length === 0 ? (
        <p>No gymnasts found.</p>
      ) : (
        <div className="gymnast-list">
          {gymnasts.map((gymnast) => (
            <div className="gymnast-card" key={gymnast.id}>
              <div>
                <strong>{gymnast.firstName} {gymnast.lastName}</strong>
              </div>
              <button onClick={() => handleDelete(gymnast.id)}>🗑 Delete</button>
            </div>
          ))}
        </div>
      )}

      {message && <ToastMessage message={message} type={messageType} />}

      {/* חלון אישור מחיקה */}
      {confirmDeleteId && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to delete this gymnast? This action cannot be undone.</p>
          <button onClick={confirmDeleteYes}>Yes</button>
          <button onClick={confirmDeleteNo}>No</button>
        </div>
      )}
    </div>
  );
}
