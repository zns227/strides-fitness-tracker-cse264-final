import { useNavigate } from "react-router-dom";

function AboutDevs() {
  const navigate = useNavigate();

  const devs = [
    {
      name: "Mary Eisenhard",
      role: "Full Stack Developer",
      bio: "I am a junior studying computer science and my favorite animal is a duck.",
      img: "/mary_gym.png"
    },
    {
      name: "Zainab Spall",
      role: "Full Stack Developer",
      bio: "I am a junior studying computer science and my favorite animal is a cat.",
      img: "/zainab.png"
    }
  ];

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>← Back to Dashboard</button>
      </div>

      <div style={heroStyle}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: "#0f172a" }}>Meet the Team</h1>
        <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: "16px" }}>The people behind Strides</p>
      </div>

      <div style={cardsContainer}>
        {devs.map((dev, i) => (
          <div key={i} style={cardStyle}>
            <img
              src={dev.img}
              alt={dev.name}
              style={avatarStyle}
            />
            <h2 style={{ margin: "16px 0 4px", fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>{dev.name}</h2>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#0ea5e9", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{dev.role}</p>
            <div style={dividerStyle} />
            <p style={{ margin: "16px 0 0", fontSize: "14px", color: "#475569", lineHeight: 1.7, textAlign: "center" }}>{dev.bio}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
        * Profile photos are AI-generated and are not real. *
      </p>
      <div style={aboutSectionStyle}>
        <h2 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 700, color: "#0f172a" }}>About Strides</h2>
        <p style={{ margin: 0, fontSize: "15px", color: "#475569", lineHeight: 1.8 }}>
          Strides was built as a final project for CSE264. We used React, Node.js, Express, and MongoDB to bring it to life.
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f1f5f9",
  padding: "28px",
  boxSizing: "border-box",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
  gap: "28px"
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end"
};

const heroStyle = {
  textAlign: "center",
  padding: "20px 0"
};

const cardsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "24px",
  maxWidth: "800px",
  margin: "0 auto",
  width: "100%"
};

const cardStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "32px 24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
};

const avatarStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #e0f2fe",
  background: "#f1f5f9"
};

const dividerStyle = {
  width: "40px",
  height: "3px",
  background: "linear-gradient(90deg, #f25811, #ff8c42)",
  borderRadius: "2px"
};

const backBtnStyle = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  background: 'linear-gradient(135deg, #0ea5e9, #0284c7',
  color: "white",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer"
};

const aboutSectionStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "28px 32px",
  maxWidth: "800px",
  width: "100%",
  margin: "0 auto",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
};

export default AboutDevs;