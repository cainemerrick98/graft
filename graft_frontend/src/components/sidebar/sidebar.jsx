import { useState } from "react";
import './sidebar.css' 
import { fetchWithAuth } from "../../api/fecthWrappers";
import Taskset from "../taskset/taskset";

function Sidebar({tasksets, activeTaskset, setActiveTaskset, setTasksets}){
    const [hidden, setHidden] = useState(false)

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

    const taskset_divs = tasksets.map(ts => 
        <Taskset key={ts.id} id={ts.id} name={ts.name} activeTaskset={activeTaskset} setActiveTaskset={setActiveTaskset} handleDeleteTaskset={handleDeleteTaskset}/>
    )

    

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