import { useState, useEffect } from "react";
import './sidebar.css' 

const initial_tasksets = [
    {name: 'taskset1', id:1, user:1},
    {name: 'taskset2', id:2, user:1},
    {name: 'taskset3', id:3, user:1},
]

function Sidebar(){
    const [tasksets, setTasksets] = useState(initial_tasksets)
    const [hidden, setHidden] = useState(false)
    const apiUrl = process.env.REACT_APP_API_URL;

    /**
     * retreives user tasksets
     */
    useEffect(() => {
        //TODO: finish API call handle
        const fetchTasksets = async () => {
            const response = await fetch(`${apiUrl}/todo/taskset/`,{
                method:'GET',
                headers:{
                  'Content-Type':'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
                }    
            })

            if(response.ok){
                const data = await response.json()
                console.log(data)
            } else{
                console.log(response)
                const data = await response.json()
                console.log(data)
            }
        }
        fetchTasksets();
    }, [])

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