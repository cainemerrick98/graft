import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskGraph from '../reactflow/taskgraph'
import Sidebar from '../sidebar/sidebar'
import './graft.css'

function Graft(){
  
    return(
      <div className='graft-container'>
        <Sidebar/>
        <TaskGraph/>
      </div>
    )
}

export default Graft


  