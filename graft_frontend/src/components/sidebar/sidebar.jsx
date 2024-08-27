import { useState } from "react";
import './sidebar.css' 
import { fetchWithAuth } from "../../api/fecthWrappers";

function Sidebar({tasksets, activeTaskset, setActiveTaskset, setTasksets}){
    const [hidden, setHidden] = useState(false)

    const taskset_divs = tasksets.map(ts => 
        <div className={`taskset ${ts.id === activeTaskset ? 'active' : ''}`} 
        id={ts.id} 
        key={ts.id}
        onClick={(e) => {setActiveTaskset(Number(e.target.id))}}>
            
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
                setActiveTaskset(taskset.id)
            }else{
                const data = await response.json()
                console.log(data)
                window.alert('Failed')
            }
        }catch(error){
            window.alert(error)
        }

    }
    
    const resetActiveTaskset = (id) => {
        if(tasksets[0].id === id){
            setActiveTaskset(tasksets[1].id)
        }else if(tasksets[tasksets.length - 1].id === id){
            setActiveTaskset(tasksets[tasksets.length - 2].id)
        }else{
            let new_active_tasket = tasksets.find((taskset, index, self) => self[index + 1].id === id)
            console.log(new_active_tasket)
            setActiveTaskset(new_active_tasket.id)
        }
    } 

    const handleDeleteTaskset = async (id) => {
        //TODO: On delete reset the activte taskset
        const options = {
            method:'DELETE',
        }

        try{
            const response = await fetchWithAuth(`todo/taskset/${id}`, options)
            if(response.ok){
                if(tasksets.length > 1){
                    resetActiveTaskset(id)
                }else{
                    setActiveTaskset(null)
                }
                setTasksets(tasksets.filter(taskset => taskset.id !== id))
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