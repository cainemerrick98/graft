import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskGraph from '../reactflow/taskgraph'
import Sidebar from '../sidebar/sidebar'
import './graft.css'

function Graft(){
  const [userID, setUserID] = useState(null)
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  /**
   * obtain the userPk from the server based on the JWT
   */
  useEffect(() => { 
    
    // This could all happen on the backend - we dont need the user id once we have the token
    // TODO: Change this so it happens on the backend
    const fetchUserInfo = async () => {
      const response = await fetch(`${apiUrl}/auth/user_info/`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if(response.ok){
        const data = await response.json()
        setUserID(data.id)
      } else{
        console.log('failed to fetch user info')
        navigate('/')
      }
    }

    fetchUserInfo()
  }, [apiUrl, navigate])
  

    return(
      <div className='graft-container'>
        <Sidebar/>
        <TaskGraph/>
      </div>
    )
}

export default Graft


  