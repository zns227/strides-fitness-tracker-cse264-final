// PreviousWorkouts - shows all past workouts in reverse order (newest first)
// receives workouts data as a prop from Dashboard
function PreviousWorkouts({ onClose, workouts }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Previous Workouts</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* show message if no workouts, otherwise loop through them */}
        {workouts.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>No workouts logged yet.</p>
        ) : (
          [...workouts].reverse().map((w, i) => (
            <div key={i} style={workoutRowStyle}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                {new Date(w.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>
              {/* each workout has multiple exercises */}
              {w.exercises.map((ex, j) => (
                <div key={j} style={{ margin: "8px 0", padding: "8px", background: "#f1f5f9", borderRadius: "8px" }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: "#0f172a", textTransform: "capitalize" }}>
                    {ex.name}
                    <span style={{ color: "#64748b", fontWeight: 400, marginLeft: "8px" }}>| Target: {ex.bodyPart}</span>
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#475569" }}>
                    {ex.sets && `${ex.sets} sets`}
                    {ex.reps && ` · ${ex.reps} reps`}
                    {(ex.duration || ex.time) && ` · ${ex.duration || ex.time} min`}
                  </p>
                </div>
              ))}
              {w.notes && (
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#475569", fontStyle: "italic" }}>
                  Notes: {w.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// styles
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