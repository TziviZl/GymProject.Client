import React from "react";
import gymImage from "./unnamed.webp";

export default function HomePage() {
  return (
    <img
      src={gymImage}
      alt="Gym"
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
      }}
    />
  );
}