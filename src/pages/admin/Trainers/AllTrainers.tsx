import React, { useEffect, useState } from "react";
import {
  getAllTrainers,
  deleteTrainer,
  MViewTrainerBL,
} from "../../../api/trainerApi";
import ToastMessage from "../../../components/shared/ToastMessage";
import "../../../css/SecretaryTrainer.css";

interface MViewStudioClass {
  id: number;
  name: string;
  trainerId: string | null;
  trainerName?: string | null;
}

export default function SecretaryTrainers() {
  const [trainers, setTrainers] = useState<MViewTrainerBL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [classesWithoutTrainer, setClassesWithoutTrainer] = useState<MViewStudioClass[] | null>(null);
  const [trainerEmails, setTrainerEmails] = useState<string[] | null>(null);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await getAllTrainers();
      setTrainers(res.data);
      setError(null);
    } catch (err) {
      setError("Error loading trainers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteYes = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await deleteTrainer(confirmDeleteId);

      if (Array.isArray(res.data) && res.data.length > 0) {
        // No substitute, show emails
        showMessage("Trainer deleted. Classes were cancelled and gymnasts updated.", "error");
        setTrainerEmails(res.data);
        setClassesWithoutTrainer([]); // can be used if you want to show classes without trainer
      } else {
        // There is a substitute
        setTrainerEmails(null);
        setClassesWithoutTrainer(null);
        showMessage("Trainer deleted and replaced successfully.", "success");
      }

      // Remove from UI
      setTrainers((prev) => prev.filter((t) => t.id !== confirmDeleteId));
    } catch (err) {
      showMessage("An error occurred while deleting the trainer", "error");
      console.error(err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const confirmDeleteNo = () => {
    setConfirmDeleteId(null);
  };

  if (loading) return <div className="contact-container">Loading trainers...</div>;
  if (error) return <div className="contact-container error">{error}</div>;

  return (
    <div className="contact-container">
      <h1>List of All Trainers</h1>

      {trainers.length === 0 ? (
        <p>No trainers found in the system.</p>
      ) : (
        <div className="trainer-list">
          {trainers.map((trainer) => (
            <div className="trainer-card" key={trainer.id}>
              <div>
                <strong>{trainer.firstName} {trainer.lastName}</strong>
              </div>
              <button onClick={() => handleDelete(trainer.id)}>🗑 Delete Trainer</button>
            </div>
          ))}
        </div>
      )}

      {message && <ToastMessage message={message} type={messageType} />}

      {confirmDeleteId && (
        <div className="confirm-delete-toast">
          <p>Are you sure you want to delete this trainer? This action is irreversible.</p>
          <button onClick={confirmDeleteYes}>Yes, delete</button>
          <button onClick={confirmDeleteNo}>Cancel</button>
        </div>
      )}

      {trainerEmails && trainerEmails.length > 0 && (
        <div className="classes-without-trainer">
          <h2>Gymnasts who received email updates:</h2>
          <ul>
            {trainerEmails.map((email, idx) => (
              <li key={idx}>{email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
