import { useState } from "react";
import './sidebar.css' 
import { fetchWithAuth } from "../../api/fecthWrappers";

function Sidebar({tasksets, activeTaskset, onTasksetChange, setTasksets}){
    const [hidden, setHidden] = useState(false)

    const taskset_divs = tasksets.map(ts => 
        <div className={`taskset ${ts.id === activeTaskset ? 'active' : ''}`} 
        id={ts.id} 
        key={ts.id}
        onClick={(e) => {onTasksetChange(Number(e.target.id))}}>
            
            <span>{ts.name}</span>
            <span onClick={() => handleDeleteTaskset(ts.id)} className="material-icons lightgrey-icon">delete</span>
            
            
        </div> 
    )

    const handleAddTaskset = async() => {
        const payload = {
            name:'new project'
        }
        const options = {
            method:'POST',
            body:JSON.stringify(payload)
        }

        try{
            const response = await fetchWithAuth('todo/taskset/', options)
            if(response.ok){
                const taskset = await response.json()
                console.log(taskset)
                setTasksets([...tasksets, taskset])
            }else{
                const data = await response.json()
                console.log(data)
                window.alert('Failed')
            }
        }catch(error){
            window.alert(error)
        }

    }

    const handleDeleteTaskset = async (id) => {

        const options = {
            method:'DELETE',
        }

        try{
            const response = await fetchWithAuth(`todo/taskset/${id}`, options)
            if(response.ok){
                setTasksets(tasksets.filter(taskset => taskset.id != id))
            }else{
                const data = await response.json()
                console.log(data)
                window.alert('Failed')
            }
        }catch(error){
            window.alert(error)
        }
        
        
    }

    return (
        <div className="sidebar" style={{height:'100%', width:'30%'}}>
            {taskset_divs}
            <div className="add-button-container">
                <button 
                onClick={handleAddTaskset}
                >+Project</button>
            </div>
        </div>
    );
}

export default Sidebar;