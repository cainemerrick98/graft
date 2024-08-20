import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "../../api/fecthWrappers";
import TaskGraphWrapper from '../reactflow/taskgraph'
import Sidebar from '../sidebar/sidebar'
import './graft.css'

function Graft(){
  const [tasksets, setTasksets] = useState([])
  const [activeTaskset, setActiveTaskset] = useState(null)
  
  /**
   * retreives user tasksets
   */
  useEffect(() => {
    const getTasksets = async () => {
      const response =  await fetchWithAuth('todo/taskset/')
      if(response.ok){
        const tasksets = await response.json()
        setTasksets(tasksets)
        setActiveTaskset(tasksets[0].id)
      }
    }
    getTasksets()
    
    //TODO: add in return function for clean up

  }, []) //Empty depednecy array means this will only run on initial render perfect
  
  const handleTasksetChange = useCallback((id) => {
    setActiveTaskset(id)
  }, [])

  return(
    <div className='graft-container'>
      <Sidebar tasksets={tasksets} 
      activeTaskset={activeTaskset}
      onTasksetChange={handleTasksetChange}
      />
      <TaskGraphWrapper activeTaskset={activeTaskset}/>
    </div>
  )
}

export default Graft


  