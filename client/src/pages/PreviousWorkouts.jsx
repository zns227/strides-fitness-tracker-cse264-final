function PreviousWorkouts({ onClose, workouts }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Previous Workouts</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {workouts.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>No workouts logged yet.</p>
        ) : (
          [...workouts].reverse().map((w, i) => (
            <div key={i} style={workoutRowStyle}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                {new Date(w.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b", textTransform: "capitalize" }}>
                {w.exercises.map(e => e.name).join(", ")}
              </p>
            </div>
          ))
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

const workoutRowStyle = {
  padding: "12px",
  background: "#f8fafc",
  borderRadius: "10px",
  marginBottom: "10px"
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280"
};

export default PreviousWorkouts;