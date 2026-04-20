import { useEffect, useState } from "react";

function LogWorkout({ onClose, user }) {
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://oss.exercisedb.dev/api/v1/exercises?limit=200")
      .then(res => res.json())
      .then(data => {
        setAllExercises(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleAddExercise = () => {
    console.log("selectedExercise:", selectedExercise);
    console.log("found:", allExercises.find(e => String(e.id) === String(selectedExercise)));
    if (!selectedExercise) return;

    const exercise = allExercises.find(e => e.name === selectedExercise);
    console.log("exercise object:", exercise);
    if (!exercise) return;

    setExercises(prev => [
      ...prev,
        {
        name: exercise.name,
        bodyPart: exercise.bodyParts?.[0] || "unknown",
        sets: sets ? Number(sets) : undefined,
        reps: reps ? Number(reps) : undefined,
        duration: duration ? Number(duration) : undefined
        }
    ]);

    // reset fields
    setSelectedExercise(null);
    setSets("");
    setReps("");
    setDuration("");
  };

  const handleRemoveExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (exercises.length === 0) return;
    setSubmitting(true);

    await fetch("http://localhost:3000/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ exercises })
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>Log Workout</h2>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {loading ? (
          <p>Loading exercises...</p>
        ) : (
          <>
            {/* EXERCISE PICKER */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
                <select
                    value={selectedExercise || ""}
                    onChange={e => setSelectedExercise(e.target.value)}
                    style={inputStyle}
                    >
                    <option value="">Select an exercise...</option>
                    {allExercises.map((ex, i) => (
                        <option key={`${ex.name}-${i}`} value={ex.name}>
                        {ex.name} ({ex.bodyPart})
                        </option>
                    ))}
                </select>

                {/* GIF PREVIEW FROM EXERCISE DB*/}
                {selectedExercise && user?.role === "beginner" && (() => {
                    const exercise = allExercises.find(e => e.name === selectedExercise);
                    return exercise?.gifUrl ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", background: "#f8fafc", borderRadius: "10px" }}>
                        <img
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }}
                        />
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#0f172a", textTransform: "capitalize" }}>{exercise.name}</p>
                            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>{exercise.bodyParts?.[0]}</p>
                        </div>
                        </div>
                    ) : null;
                })()}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Sets"
                  value={sets}
                  onChange={e => setSets(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button onClick={handleAddExercise} style={addBtnStyle}>
                + Add Exercise
              </button>
            </div>

            {/* ADDED EXERCISES LIST */}
            {exercises.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ marginBottom: "10px" }}>Exercises in this workout:</h4>
                {exercises.map((ex, i) => (
                  <div key={i} style={exerciseRowStyle}>
                    <div>
                      <strong>{ex.name}</strong>
                      <span style={{ color: "#6b7280", marginLeft: "8px", fontSize: "13px" }}>{ex.bodyPart}</span>
                      <div style={{ fontSize: "13px", color: "#374151", marginTop: "2px" }}>
                        {ex.sets && `${ex.sets} sets`}
                        {ex.reps && ` · ${ex.reps} reps`}
                        {ex.duration && ` · ${ex.duration} min`}
                      </div>
                    </div>
                    <button onClick={() => handleRemoveExercise(i)} style={removeBtnStyle}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={exercises.length === 0 || submitting}
              style={{
                ...submitBtnStyle,
                opacity: exercises.length === 0 || submitting ? 0.5 : 1
              }}
            >
              {submitting ? "Saving..." : "Save Workout"}
            </button>
          </>
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

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box"
};

const addBtnStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#25cafc",
  color: "white",
  fontSize: "14px",
  cursor: "pointer"
};

const submitBtnStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#f25811",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};

const exerciseRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  background: "#f9fafb",
  borderRadius: "8px",
  marginBottom: "8px"
};

const removeBtnStyle = {
  background: "none",
  border: "none",
  color: "#ef4444",
  cursor: "pointer",
  fontSize: "16px"
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#6b7280"
};

export default LogWorkout;