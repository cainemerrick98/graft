import './login.css'
import {fetchWithAuth, fetchWithLogin} from '../../api/fecthWrappers'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const navigate = useNavigate()

  /**
   * used to check if the user is already logged in
   * if so they are redirected to their taskgraphs
   */
  useEffect(() => {

    const verifyToken = async () => {
      const response = await fetchWithAuth('auth/verify_token/')
      if(response.ok){
        navigate('/taskgraph')
      }
    }

    verifyToken()
    
  }, [navigate])

  /**
   * @param {SubmitEvent} e 
   */
  async function handleLogin(e){
    e.preventDefault()
    const response = await fetchWithLogin(username, password)

    if (response.ok){
      const data = await response.json()
      localStorage.setItem('refreshToken', data.refresh)
      localStorage.setItem('accessToken', data.access)
      window.location.href = '/taskgraph'
    } else{
      setLoginError('*incorrect username or password')
    }
    
  }

  return(
    <div className='login-container'>
      <form className='login' onSubmit={handleLogin}>
        <h1>Login</h1>
        {loginError && (
          <p className='error-msg'>{loginError}</p>
        )}
        <input 
          type='text' 
          placeholder='username'
          onChange={(e) => setUsername(e.target.value)}
          className='login-input'
          />
        <input 
        type='text' 
        placeholder='password'
        onChange={(e) => setPassword(e.target.value)}
        className='login-input'
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login

