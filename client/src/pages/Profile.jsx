import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Profile page - shows account info, role switching, and password change
function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [roleMsg, setRoleMsg] = useState('')
  const navigate = useNavigate()

  // fetch user profile data on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err))
  }, [])

  // handles password change with validation
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMsg('')
    setPasswordError(false)

    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match')
      setPasswordError(true)
      return
    }

    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters')
      setPasswordError(true)
      return
    }

    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/api/auth/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    const data = await res.json()

    if (!res.ok) {
      setPasswordMsg(data.message)
      setPasswordError(true)
    } else {
      setPasswordMsg('Password updated successfully')
      setPasswordError(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  // lets users switch between beginner and expert
  const handleRoleSwitch = async () => {
    const newRole = profile.role === 'beginner' ? 'expert' : 'beginner'
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:3000/api/auth/role', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    })
    const data = await res.json()

    if (res.ok) {
      // update both local profile state and parent App state
      setProfile({ ...profile, role: newRole })
      setUser({ ...user, role: newRole })
      setRoleMsg(`Switched to ${newRole}`)
    }
  }

  // show loading while profile data is being fetched
  if (!profile) return <div style={pageStyle}><p>Loading...</p></div>

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div style={pageStyle}>
      {/* header */}
      <div style={headerStyle}>
        <div>
          <p style={labelStyle}>Profile</p>
          <h1 style={titleStyle}>{profile.name}</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>← Back to Dashboard</button>
      </div>

      {/* avatar with user's initials */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 700,
            color: 'white'
        }}>
          {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
      </div>

      <div style={gridStyle}>
        {/* account info card */}
        <div style={{ ...cardStyle, minHeight: '250px' }}>
          <h3 style={cardTitleStyle}>Account Info</h3>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Name</span>
            <span style={infoValueStyle}>{profile.name}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Username</span>
            <span style={infoValueStyle}>{profile.username}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Email</span>
            <span style={infoValueStyle}>{profile.email}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Member since</span>
            <span style={infoValueStyle}>{memberSince}</span>
          </div>
        </div>

        {/* role card - lets user switch between beginner and expert */}
        <div style={{ ...cardStyle, minHeight: '250px' }}>
          <h3 style={cardTitleStyle}>Fitness Level</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              background: profile.role === 'expert' ? '#dbeafe' : '#dcfce7',
              color: profile.role === 'expert' ? '#1e40af' : '#166534'
            }}>
              {profile.role === 'expert' ? 'Expert' : 'Beginner'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', minHeight: '40px' }}>
            {profile.role === 'beginner'
              ? 'As a beginner, you see exercise instructions when logging workouts.'
              : 'As an expert, you also have access to all advanced features and tools.'}
          </p>
          <button onClick={handleRoleSwitch} style={switchBtnStyle}>
            Switch to {profile.role === 'beginner' ? 'Expert' : 'Beginner'}
          </button>
          {roleMsg && <p style={{ marginTop: '8px', fontSize: '13px', color: '#10b981' }}>{roleMsg}</p>}
        </div>

        {/* change password card */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h3 style={cardTitleStyle}>Change Password</h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <div>
              <label style={formLabelStyle}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={formLabelStyle}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={formLabelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            {passwordMsg && (
              <p style={{ fontSize: '13px', color: passwordError ? '#ef4444' : '#10b981', margin: 0 }}>
                {passwordMsg}
              </p>
            )}
            <button type="submit" style={saveBtnStyle}>Update Password</button>
          </form>
        </div>
      </div>
    </div>
  )
}

// styles
const pageStyle = {
  width: '100%',
  padding: '20px',
  background: '#f1f5f9',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  boxSizing: 'border-box'
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
}

const labelStyle = {
  margin: 0,
  fontSize: '13px',
  color: '#94a3b8',
  letterSpacing: '0.05em',
  textTransform: 'uppercase'
}

const titleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: '#0f172a'
}

const backBtnStyle = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
  color: "white",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer"
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px'
}

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '16px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
}

const cardTitleStyle = {
  margin: '0 0 16px',
  fontSize: '15px',
  fontWeight: 700,
  color: '#0f172a'
}

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid #f1f5f9'
}

const infoLabelStyle = {
  fontSize: '14px',
  color: '#64748b'
}

const infoValueStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#0f172a'
}

const switchBtnStyle = {
  padding: '8px 20px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#374151',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer'
}

const formLabelStyle = {
  display: 'block',
  fontSize: '13px',
  color: '#64748b',
  marginBottom: '4px'
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
  background: "white",
  color: "#0f172a",
  fontFamily: "'Inter', 'Segoe UI', sans-serif"
};

const saveBtnStyle = {
  padding: '10px 24px',
  borderRadius: '8px',
  border: 'none',
  background: '#f25811',
  color: 'white',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  alignSelf: 'flex-start'
}

export default Profile