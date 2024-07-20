import { useState } from "react";
import './sidebar.css' 

const initial_tasksets = [
    {name: 'taskset1', id:1, user:1},
    {name: 'taskset2', id:2, user:1},
    {name: 'taskset3', id:3, user:1},
]

function Sidebar(){
    const [tasksets, setTasksets] = useState(initial_tasksets)
    const [hidden, setHidden] = useState(false)

    const taskset_divs = tasksets.map(ts => 
        <div className="taskset" id={ts.id} key={ts.id}>
            {ts.name}
        </div> 
    )

    return (
        <div className="sidebar" style={{height:'100%', width:'30%'}}>
            {taskset_divs}
        </div>
    );
}

export default Sidebar;