import { useState } from "react";
import './sidebar.css' 

function Sidebar({tasksets, activeTaskset, onTasksetChange}){
    const [hidden, setHidden] = useState(false)

    const taskset_divs = tasksets.map(ts => 
        <div className={`taskset ${ts.id === activeTaskset ? 'active' : ''}`} 
        id={ts.id} 
        key={ts.id}
        onClick={(e) => {onTasksetChange(Number(e.target.id))}}
        >
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