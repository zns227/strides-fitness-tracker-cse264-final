import { useEffect, useState } from "react";

function Suggestions({ onClose, weekly, user }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [neglectedPart, setNeglectedPart] = useState("");

  const allBodyParts = ["chest", "back", "waist", "upper legs", "lower legs", "upper arms", "lower arms", "shoulders", "neck", "cardio"];

  useEffect(() => {
    // figure out which body parts were trained this week
    const trainedThisWeek = new Set(
      Object.values(weekly).flatMap(day => Object.keys(day || {}))
    );

    // find first body part not trained
    const untrained = allBodyParts.find(part => !trainedThisWeek.has(part)) || allBodyParts[0];
    setNeglectedPart(untrained);

    fetch(`http://localhost:3000/api/dashboard/suggestions?bodyPart=${encodeURIComponent(untrained)}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <h2 style={{ margin: 0 }}>Suggestions</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#64748b", textTransform: "capitalize" }}>
          You haven't trained <strong>{neglectedPart}</strong> recently — here are some exercises to try:
        </p>

        {loading ? (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>Finding suggestions...</p>
        ) : exercises.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>No exercises found for this body part.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {exercises.map((ex, i) => (
              <div key={i} style={exerciseRowStyle}>
                {user?.role === "beginner" && ex.gifUrl && (
                  <img
                    src={ex.gifUrl}
                    alt={ex.name}
                    style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                )}
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#0f172a", textTransform: "capitalize" }}>
                    {ex.name}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>
                    {ex.bodyParts?.[0]} · {ex.equipments?.[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "30px",
  width: "500px",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
};

const exerciseRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "12px",
  background: "#f8fafc",
  borderRadius: "10px"
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280"
};

export default Suggestions;