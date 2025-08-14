import { useContext, useState } from 'react'
// import '../index.css'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user'

const AdminLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', form: '' }) // Include a general error field
  const navigate = useNavigate()
  const {login,toggle,username1,setUsername1}=useContext(UserContext)

  const HandleSubmit = async (e) => {
    e.preventDefault()

    const auth = { email, password }
    try {
      const response = await fetch('http://localhost:4000/api/login_admin', {
        method: 'POST',
        body: JSON.stringify(auth),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      
      if (!response.ok) {
        setErrors(json.errors)
        setErrors({ ...errors, form: 'Invalid credentials. Please try again.' })
      }
      else{
        
        toggle();
        const{username}=json;
        setUsername1(username);
        
        
        // setErrors=useState({ email: '', password: '', form: '' });
        setEmail('')
        setPassword('')
        navigate('/')
      }
    } catch (err) {
      console.error('Request failed:', err)
      setErrors({ ...errors, form: 'Failed to log in. Please try again later.' }) 
    }
  }

  return (
    <div className="form_container">
    <form className="create" onSubmit={HandleSubmit}>
      <h3>Admin Login</h3>

      <label>Email:</label>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {errors.email && <div className="error">{errors.email}</div>}
      
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {errors.password && <div className="error">{errors.password}</div>}

      <button>Login</button>

      {errors.form && <div className="error">{errors.form}</div>} 
      </form>
      </div>
  )
}

export default AdminLoginForm
