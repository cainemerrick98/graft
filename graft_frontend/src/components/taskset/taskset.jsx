import './taskset.css'
import { useState, useRef, useEffect } from 'react'
import { fetchWithAuth } from '../../api/fecthWrappers'

function Taskset({id, name, setActiveTaskset, activeTaskset, handleDeleteTaskset}){
    const [tasksetName, setTasksetName] = useState(name)
    const [edit, setEdit] = useState(false)
    const inputRef = useRef(null)


    const handleSetEdit = () => {
        setEdit((prevEdit) => !prevEdit)
    }

    useEffect(() => {
        if (edit && inputRef.current) {
            console.log(inputRef.current) // Log input ref
            inputRef.current.focus() // Focus on the input
            inputRef.current.select() // Highlight the text
          }
        }, [edit]
    )
    
    const handleInputChange = (e) => {
        setTasksetName(e.target.value)
    }

    const saveTasksetName = async() => {
        const options = {
            method:'PATCH',
            body:JSON.stringify({name:tasksetName})
        }

        try{
            const response = await fetchWithAuth(`todo/taskset/${id}/`, options)
            if(response.ok){
                console.log('Success')
            }else{
                const data =  await response.json()
                console.log(data)
                window.alert('Failed')
            }
        }catch(error){
            window.alert(error)
        }

    }

    return (
        <div className={`taskset ${id === activeTaskset ? 'active' : ''}`} 
        id={id} 
        key={id}
        onClick={() => setActiveTaskset(Number(id))}
        onDoubleClick={() => handleSetEdit()}
        >
            {!edit && (
                <>
                <span>{tasksetName}</span>
                <span onClick={() => handleDeleteTaskset(id)} className="material-icons lightgrey-icon">delete</span>
                </>
            )}
            {edit && (
                <>
                <input value={tasksetName} ref={inputRef} onChange={handleInputChange} onBlur={saveTasksetName}/>
                <span onClick={() => handleDeleteTaskset(id)} className="material-icons lightgrey-icon">delete</span>
                </>
            )}
        </div> 
    )
}

export default Taskset