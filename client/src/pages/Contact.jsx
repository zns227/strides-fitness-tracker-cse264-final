import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type: document.querySelector('select').value, message })
        })
        if (res.ok) {
        setSubmitted(true)
        setName('')
        setEmail('')
        setMessage('')
        }
    } catch (err) {
        console.error('Feedback error:', err)
    }
    }

    return (
    <div style={pageStyle}>
        <div style={headerStyle}>
        <div>
            <p style={labelStyle}>Contact</p>
            <h1 style={titleStyle}>Send Us Feedback</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>← Back to Dashboard</button>
        </div>

        <div style={contentStyle}>
        <div style={cardStyle}>
            {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Thanks for your feedback!</h2>
                <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>We appreciate you taking the time to reach out.</p>
                <button onClick={() => setSubmitted(false)} style={submitBtnStyle}>Send Another</button>
            </div>
            ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                <label style={formLabelStyle}>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    style={inputStyle}
                />
                </div>
                <div>
                <label style={formLabelStyle}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                />
                </div>
                <div>
                <label style={formLabelStyle}>Type</label>
                <select style={inputStyle} defaultValue="feedback">
                    <option value="feedback">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                </select>
                </div>
                <div>
                <label style={formLabelStyle}>Message</label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="Tell us what you think..."
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
                </div>
                <button type="submit" style={submitBtnStyle}>Submit Feedback</button>
            </form>
            )}
        </div>

        <div style={infoCardStyle}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Get in Touch</h3>
            <div style={infoRowStyle}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Email</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}> strides@gmail.com</span>
            </div>
            <div style={infoRowStyle}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Built by</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Mary & Zainab</span>
            </div>
            <div style={infoRowStyle}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Course</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>CSE 264</span>
            </div>
        </div>
        </div>
    </div>
    )
    }

    const pageStyle = {
    minHeight: '100vh',
    width: '100%',
    padding: '28px',
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
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
    }

    const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr',
    gap: '20px',
    maxWidth: '900px'
    }

    const cardStyle = {
    background: 'white',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }

    const infoCardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    alignSelf: 'flex-start'
    }

    const formLabelStyle = {
    display: 'block',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px'
    }

    const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: "white", color: "#94a3b8"
    }

    const submitBtnStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#f25811',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start'
    }

    const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
    gap: '16px'
    }

    export default Contact