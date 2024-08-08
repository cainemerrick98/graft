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


  