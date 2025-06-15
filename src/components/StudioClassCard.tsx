import React, { useEffect, useState } from "react";
import { getAllLessons, MViewStudioClasses } from "../api/classApi";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function LessonsTable() {
  const [lessons, setLessons] = useState<MViewStudioClasses[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllLessons()
      .then((res) => {
        setLessons(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading lessons:", err);
        setError("Error loading lessons");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading lessons...</div>;
  if (error) return <div>{error}</div>;

  // קיבוץ השיעורים לפי יום באנגלית
  const lessonsByDay = lessons.reduce((acc, lesson) => {
    const dayIndex = new Date(lesson.date).getDay();
    const dayName = daysOfWeek[dayIndex];
    if (!acc[dayName]) acc[dayName] = [];
    acc[dayName].push(lesson);
    return acc;
  }, {} as Record<string, MViewStudioClasses[]>);

  return (
    <div>
      <h2>Lessons Schedule</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th
                key={day}
                style={{ border: "1px solid #ccc", padding: "8px", backgroundColor: "#f0f4f8" }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {daysOfWeek.map((day) => (
              <td
                key={day}
                style={{ border: "1px solid #ccc", verticalAlign: "top", padding: "8px" }}
              >
                {lessonsByDay[day]?.length ? (
                  lessonsByDay[day].map((lesson, idx) => (
                    <div
                      key={idx}
                      style={{ marginBottom: "12px", fontFamily: "Arial, sans-serif" }}
                    >
                      <strong>{lesson.name}</strong>
                      <br />
                      Level: {lesson.level}
                      <br />
                      Date: {new Date(lesson.date).toLocaleDateString("en-US")}
                      <br />
                      Teacher: {lesson.trainerName || "N/A"}
                    </div>
                  ))
                ) : (
                  <em>No lessons</em>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
