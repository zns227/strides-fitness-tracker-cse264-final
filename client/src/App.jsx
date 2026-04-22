import {useState, useEffect} from 'react'
import Login from './Login'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  if (!user) return <Login />

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <p>Role: {user.role}</p>
      <button onClick={() => { localStorage.clear(); window.location.reload() }}>Logout</button>
    </div>
  )
}

export default App