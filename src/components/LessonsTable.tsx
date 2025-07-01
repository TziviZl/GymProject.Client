import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllLessons,
  MViewStudioClasses,
  isFull,
  isCancelled,
  cancelClass,
} from "../api/classApi";
import { addGymnastLesson, removeGymnastFromClass } from "../api/gymnastApi";
import { getNumOfGymnasts, getTrainerById, MTrainer } from "../api/trainerApi";
import ToastMessage from "./shared/ToastMessage";
import "../css/LessonsTable.css";
import Loader from "./shared/Loader";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function getUpcomingWeekDates(): Record<string, string> {
  const today = new Date();
  const isSaturdayAfter8pm = today.getDay() === 6 && today.getHours() >= 20;
  const baseDate = new Date(today);
  if (isSaturdayAfter8pm) baseDate.setDate(baseDate.getDate() + 1);
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

function TrainerButtons({
  lesson,
  onShowGymnasts,
  onCancelLesson,
  isCancelled,
  isPast,
}: {
  lesson: MViewStudioClasses;
  onShowGymnasts: (lesson: MViewStudioClasses) => void;
  onCancelLesson: (lessonId: number) => void;
  isCancelled: boolean;
  isPast: boolean;
}) {
  if (isCancelled || isPast) {
    return (
      <div className="trainer-buttons">
        <button className="small-button" disabled>
          {isCancelled ? "Cancelled" : "Class Passed"}
        </button>
      </div>
    );
  }
  return (
    <div className="trainer-buttons">
      <button
        className="small-button"
        onClick={() => onShowGymnasts(lesson)}
        disabled={isPast}
      >
        Show Gymnasts
      </button>
      <button
        className="small-button"
        onClick={() => onCancelLesson(lesson.id)}
        disabled={isPast}
        style={{ marginLeft: 10 }}
      >
        Cancel
      </button>
    </div>
  );
}

// קומפוננטת כרטיס שיעור רגילה (למאמן אחר או למשתמש רגיל)
function LessonCard({
  lesson,
  disabled,
  buttonLabel,
  extraNote,
  onJoin,
}: {
  lesson: MViewStudioClasses;
  disabled: boolean;
  buttonLabel: string;
  extraNote?: string;
  onJoin?: () => void;
}) {
  const lessonDateTime = new Date(lesson.date);

  return (
    <div
      className="lesson-card"
      style={extraNote ? { opacity: 0.5 } : undefined}
    >
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
      <button disabled={disabled} onClick={onJoin}>
        {buttonLabel}
      </button>
      {extraNote && <p><i>{extraNote}</i></p>}
    </div>
  );
}
function ManageGymnastPopup({
  lessonId,
  onClose,
  onSuccess,
  onError,
}: {
  lessonId: number;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [gymnastId, setGymnastId] = useState("");

  const handleAdd = async () => {
    try {
      await addGymnastLesson(gymnastId, lessonId);
      onSuccess("Gymnast added successfully");
      onClose();
    } catch (err: any) {
      onError(err?.response?.data || "Error adding gymnast");
    }
  };

  const handleRemove = async () => {
    try {
      await removeGymnastFromClass(gymnastId, lessonId);
      onSuccess("Gymnast removed successfully");
      onClose();
    } catch (err: any) {
      onError(err?.response?.data || "Error removing gymnast");
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        type="text"
        value={gymnastId}
        onChange={(e) => setGymnastId(e.target.value)}
        placeholder="Enter Gymnast ID"
        style={{ padding: "6px", width: "60%", marginBottom: "8px" }}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button className="small-button" onClick={handleAdd}>
          Add
        </button>
        <button className="small-button" onClick={handleRemove}>
          Remove
        </button>
        <button className="small-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}


export default function LessonsTable() {
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [fullStatus, setFullStatus] = useState<Record<number, boolean>>({});
  const [cancelledStatus, setCancelledStatus] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loggedTrainer, setLoggedTrainer] = useState<MTrainer | null>(null);
  const [manageLessonId, setManageLessonId] = useState<number | null>(null);

  const userType = localStorage.getItem("userType");
  const trainerId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const weekDates = getUpcomingWeekDates();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let lessonsData: MViewStudioClasses[] = [];

        if (userType === "trainer" && trainerId) {
          const trainerRes = await getTrainerById(trainerId);
          setLoggedTrainer(trainerRes.data);

          const lessonsRes = await getAllLessons();
          lessonsData = lessonsRes.data;
        } else {
          const lessonsRes = await getAllLessons();
          lessonsData = lessonsRes.data;
        }

        setLessons(lessonsData);
        console.log("Lessons:", lessons);

        const fullMap: Record<number, boolean> = {};
        const cancelMap: Record<number, boolean> = {};

        await Promise.all(
          lessonsData.map(async (lesson) => {
            try {
              const [fullRes, cancelRes] = await Promise.all([
                isFull(lesson.id),
                isCancelled(lesson.id),
              ]);
              fullMap[lesson.id] = fullRes.data;
              cancelMap[lesson.id] = cancelRes.data;
            } catch {
              fullMap[lesson.id] = false;
              cancelMap[lesson.id] = false;
            }
          })
        );

        setFullStatus(fullMap);
        setCancelledStatus(cancelMap);
        setError(null);
      } catch (err) {
        setError("Failed loading lessons");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainerId, userType]);

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleJoinLesson = async (lesson: MViewStudioClasses) => {
    const gymnastId = localStorage.getItem("userId");
    if (!gymnastId) {
      showMessage("Please log in before registering", "error");
      navigate("/Login");
      return;
    }

    if (cancelledStatus[lesson.id]) {
      showMessage("Class has been cancelled", "error");
      return;
    }

    if (fullStatus[lesson.id]) {
      showMessage("Class is full", "error");
      return;
    }

    if (!lesson.trainerID) {
      showMessage("Cannot register to a class without a trainer", "error");
      return;
    }

    try {
      await addGymnastLesson(gymnastId, lesson.id);
      showMessage("Successfully registered!", "success");
    } catch (err: any) {
      showMessage(err?.response?.data || "Error registering", "error");
    }
  };

  const handleShowNumOfGymnasts = async (lesson: MViewStudioClasses) => {
    try {
      let trainerIdForRequest: string | null = null;

      if (userType === "trainer" && loggedTrainer) {
        trainerIdForRequest = loggedTrainer.id;
      } else if (lesson.trainerID) {
        trainerIdForRequest = lesson.trainerID;
      }

      if (!trainerIdForRequest) {
        showMessage("Trainer not assigned for this class", "error");
        return;
      }

      const res = await getNumOfGymnasts(trainerIdForRequest, lesson.date);
      showMessage(`Number of gymnasts: ${res.data}`, "success");
    } catch (err) {
      showMessage("Failed fetching gymnasts count", "error");
      console.error(err);
    }
  };

  const handleCancelLesson = async (lessonId: number) => {
    try {
      await cancelClass(lessonId);
      showMessage("Lesson cancelled successfully", "success");
      setCancelledStatus((prev) => ({ ...prev, [lessonId]: true }));
    } catch (error) {
      showMessage("Failed to cancel lesson", "error");
      console.error("Cancel lesson error:", error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  // מארגן את השיעורים לפי יום
  const lessonsByDay = lessons.reduce((acc, lesson) => {
    const dayName = daysOfWeek[new Date(lesson.date).getDay()];
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
                const isPast = lessonDateTime.getTime() < Date.now();
                const isFullLesson = fullStatus[lesson.id];
                const isCancelledLesson = cancelledStatus[lesson.id];
                const disabled = isPast || isFullLesson || isCancelledLesson || !lesson.trainerID;

                if (userType === "secretary") {
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

                      <TrainerButtons
                        lesson={lesson}
                        onShowGymnasts={handleShowNumOfGymnasts}
                        onCancelLesson={handleCancelLesson}
                        isCancelled={isCancelledLesson}
                        isPast={isPast}



                      />
                      <button
                        className="small-button"
                        onClick={() => setManageLessonId(lesson.id)}
                        disabled={isCancelledLesson || isPast}
                        style={{ marginTop: 5 }}
                      >
                        Manage Gymnasts
                      </button>


                    </div>
                  );
                }

                if (userType === "trainer" && loggedTrainer) {
                  if (String(lesson.trainerID) === String(loggedTrainer.id)) {
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

                        <TrainerButtons
                          lesson={lesson}
                          onShowGymnasts={handleShowNumOfGymnasts}
                          onCancelLesson={handleCancelLesson}
                          isCancelled={isCancelledLesson}
                          isPast={isPast}
                        />
                      </div>
                    );
                  } else {
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
                        <button className="small-button" disabled>
                          Not your class
                        </button>
                      </div>
                    );
                  }
                }

                return (
                  <LessonCard
                    key={idx}
                    lesson={lesson}
                    disabled={disabled}
                    buttonLabel={
                      isPast
                        ? "Class Passed"
                        : isCancelledLesson
                          ? "Cancelled"
                          : isFullLesson
                            ? "Full"
                            : "Join"
                    }
                    onJoin={() => handleJoinLesson(lesson)}
                  />
                );
              })
            ) : (
              <p style={{ opacity: 0.6 }}>No lessons</p>
            )}
          </div>
        ))}
      </div>

      {message && <ToastMessage message={message} type={messageType} />}
      {manageLessonId !== null && (
  <div
    className="manage-gymnast-backdrop"
    onClick={() => setManageLessonId(null)}
  >
    <div
      className="manage-gymnast-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <ManageGymnastPopup
        lessonId={manageLessonId}
        onClose={() => setManageLessonId(null)}
        onSuccess={(msg) => showMessage(msg, "success")}
        onError={(msg) => showMessage(msg, "error")}
      />
    </div>
  </div>
)}

    </div>
  );
}