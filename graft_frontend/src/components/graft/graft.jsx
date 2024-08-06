import './graft.css'
import TaskGraph from '../reactflow/taskgraph'
import Sidebar from '../sidebar/sidebar'

function Graft(){
    return(
      <div className='graft-container'>
        <Sidebar/>
        <TaskGraph/>
      </div>
    )
}

export default Graft


  