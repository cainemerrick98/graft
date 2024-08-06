import './login.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL;

  /**
   * used to check if the user is already logged in
   * if so they are redirected to their taskgraphs
   */
  useEffect(() => {
    //TODO: check if token is valid
    const token = localStorage.getItem('accessToken')
    if(token){
      navigate('/taskgraph')
    }
  }, [navigate])

  /**
   * @param {SubmitEvent} e 
   */
  async function handleLogin(e){
    e.preventDefault()
    const response = await fetch(`${apiUrl}/auth/login/`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({username, password})
    })
    
    if (response.ok){
      const data = await response.json()
      localStorage.setItem('refreshToken', data.refresh)
      localStorage.setItem('accessToken', data.access)
      navigate('/taskgraph')
    } else{
      // TODO: Handle incorrect details with error message
      console.log(response)
      const data = await response.json()
      console.log(data)
    }
  }

  return(
    <div className='login-container'>
      <form className='login' onSubmit={handleLogin}>
        <h1>Login</h1>
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

