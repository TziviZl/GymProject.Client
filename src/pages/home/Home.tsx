import React from "react";
import gymImage from "./assets_task_01jxxb06bte4ybqa0tjk0vftkd_1750110156_img_0.webp";

export default function HomePage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* תמונת רקע */}
      <img
        src={gymImage}
        alt="Gym background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: "white",
          fontSize: "2rem",
          paddingTop: "3rem",
          textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
        }}
      >
      </div>
    </div>
  );
}
