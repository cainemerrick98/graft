import { useState, useEffect } from "react";
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
        if(tasksets.length == 0){
          setTasksets([])
          setActiveTaskset(null)
        }else{
          setTasksets(tasksets)
          setActiveTaskset(tasksets[0].id)
        }
      }
    }
    getTasksets()
    
    //TODO: add in return function for clean up

  }, []) //Empty depednecy array means this will only run on initial render perfect
  

  return(
    <div className='graft-container'>
      <Sidebar tasksets={tasksets} 
      activeTaskset={activeTaskset}
      setActiveTaskset={setActiveTaskset}
      setTasksets={setTasksets}
      />
      <TaskGraphWrapper activeTaskset={activeTaskset}/>
    </div>
  )
}

export default Graft


  