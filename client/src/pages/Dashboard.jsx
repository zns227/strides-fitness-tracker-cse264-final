import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import Confetti from 'react-confetti'; 
import { useWindowSize } from 'react-use';
import LogWorkout from "./LogWorkout";
import PreviousWorkouts from "./PreviousWorkouts";
import Suggestions from "./Suggestions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard() {
  const [stats, setStats] = useState({});
  const [summary, setSummary] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [weekly, setWeekly] = useState({});
  const [user, setUser] = useState(null);

  // button popups
  const [showLogWorkout, setShowLogWorkout] = useState(false);
  const [showPreviousWorkouts, setShowPreviousWorkouts] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // confetti states!!!!
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();


  const navigate = useNavigate()

  // charts data
  const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const bodyParts = [
    ...new Set(
      Object.values(weekly).flatMap(day => Object.keys(day || {}))
    )
  ];

  // full color map — keys match exactly what ExerciseDB returns (lowercase)
  const colorMap = {
    "chest": "#ef4444",
    "back": "#3b82f6",
    "waist": "#f59e0b",
    "upper arms": "#8b5cf6",
    "lower arms": "#a78bfa",
    "upper legs": "#10b981",
    "lower legs": "#34d399",
    "shoulders": "#f97316",
    "cardio": "#ec4899",
    "neck": "#06b6d4",
    "unknown": "#6b7280"
  };

  const datasets = bodyParts.map(part => ({
    label: part,
    data: allDays.map(day => weekly?.[day]?.[part] || 0),
    backgroundColor: colorMap[part] || "#6b7280"
  }));

  const chartData = { labels: allDays, datasets };

  // achievements widget data
  const achievements = [
    { label: "5 Workouts", target: 5, icon: "🥈" },
    { label: "10 Workouts", target: 10, icon: "🏅" },
    { label: "50 Workouts", target: 50, icon: "🏆" }
  ];

  // quote widget data
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "The secret of getting ahead is getting started.",
    "If it doesn’t challenge you, it doesn’t change you.",
    "Start where you are. Use what you have. Do what you can."
  ];

  const todayQuote = quotes[new Date().getDay() % quotes.length];

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    try {
      const [statsRes, summaryRes, weeklyRes, workoutsRes, userRes] = await Promise.all([
        fetch("http://localhost:3000/api/dashboard/stats", { headers }),
        fetch("http://localhost:3000/api/dashboard/summary", { headers }),
        fetch("http://localhost:3000/api/dashboard/weekly", { headers }),
        fetch("http://localhost:3000/api/workouts", { headers }),
        fetch("http://localhost:3000/api/auth/me", { headers })
      ])

      const statsData = await statsRes.json()
      const summaryData = await summaryRes.json()
      const weeklyData = await weeklyRes.json()
      const workoutsData = await workoutsRes.json()
      const userData = await userRes.json()

      // triggering the confetti if an achievement is reached
      const isAchievementReached = achievements.some(a => a.target === summaryData.totalWorkouts);
    
      if (isAchievementReached) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000); // Stop after 5 seconds
      }

      setStats(statsData.bodyPartStats || {})
      setSummary(summaryData.totalWorkouts)
      setWeekly(weeklyData)
      setWorkouts(workoutsData || [])
      setUser(userData)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/login";
  };

  return (
    <div style={pageStyle}>

      { /* CONFETTI */} 
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false} 
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>Dashboard</p>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
            Welcome back, {user?.name || "user"}!
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/profile')} style={{ ...logoutBtnStyle, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>Profile</button>
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* QUOTE CARD */}
          <div style={quoteCardStyle}>
            <p style={{ margin: 0, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>
              Daily Motivation
            </p>
            <p style={{ margin: "12px 0 0", fontSize: "22px", fontWeight: 600, lineHeight: 1.4 }}>
              {todayQuote}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            {[
              { label: "Log Workout", icon: "➕", onClick: () => setShowLogWorkout(true) },
              { label: "Previous Workouts", icon: "📋", onClick: () => setShowPreviousWorkouts(true) },
              { label: "Suggestions", icon: "💡", onClick: () => setShowSuggestions(true) }
            ].map((btn, i) => (
              <button key={i} onClick={btn.onClick} style={actionBtnStyle}>
                <span style={{ fontSize: "28px", display: "block", marginBottom: "8px" }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          {/* CHART */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Weekly Activity</h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: {
                  x: { stacked: true, grid: { display: false } },
                  y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
                }
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* TOTAL WORKOUTS STAT */}
          <div style={{ ...cardStyle, textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <p style={{ margin: 0, fontSize: "13px", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Workouts</p>
            <p style={{ margin: "8px 0 0", fontSize: "48px", fontWeight: 800, lineHeight: 1 }}>{summary}</p>
          </div>

          {/* ACHIEVEMENTS */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Achievements</h3>
            {achievements.map((a, i) => {
              const progress = Math.min((summary / a.target) * 100, 100);
              const done = progress >= 100;
              return (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: done ? "#10b981" : "#374151" }}>
                      {a.icon} {a.label}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={progressBgStyle}>
                    <div style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: done
                        ? "linear-gradient(90deg, #10b981, #34d399)"
                        : "linear-gradient(90deg, #667eea, #764ba2)",
                      borderRadius: "10px",
                      transition: "width 0.6s ease"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* closing buttons */}
      {showLogWorkout && <LogWorkout onClose={() => { setShowLogWorkout(false); fetchData(); }} user={user} />}
      {showPreviousWorkouts && <PreviousWorkouts onClose={() => setShowPreviousWorkouts(false)} workouts={workouts} />}
      {showSuggestions && <Suggestions onClose={() => setShowSuggestions(false)} weekly={weekly} user={user} />}
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  padding: "28px",
  background: "#f1f5f9",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  boxSizing: "border-box",
  fontFamily: "'Inter', 'Segoe UI', sans-serif"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const quoteCardStyle = {
  background: "linear-gradient(135deg, #f25811 0%, #ff8c42 100%)",
  color: "white",
  padding: "28px 32px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(242, 88, 17, 0.3)"
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
};

const cardTitleStyle = {
  margin: "0 0 16px",
  fontSize: "15px",
  fontWeight: 700,
  color: "#0f172a"
};

const actionBtnStyle = {
  height: "110px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #25cafc 0%, #0ea5e9 100%)",
  color: "white",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(37, 202, 252, 0.35)",
  transition: "transform 0.1s ease, box-shadow 0.1s ease"
};

const logoutBtnStyle = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)"
};

const progressBgStyle = {
  width: "100%",
  height: "8px",
  background: "#e5e7eb",
  borderRadius: "10px",
  overflow: "hidden"
};

export default Dashboard;