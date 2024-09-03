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
            inputRef.current.focus() 
            inputRef.current.select()
          }
        }, [edit]
    )
    
    const handleInputChange = (e) => {
        setTasksetName(e.target.value)
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            saveTasksetName()
        }

    }

    //TODO add handle empty name! 
    //Name cannot be empty so should revert to previous or not allow to leave without updating
    //Revert to previous is better UX
    const saveTasksetName = async() => {
        handleSetEdit()
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
                <input value={tasksetName} ref={inputRef} onChange={handleInputChange} onBlur={saveTasksetName} onKeyDown={handleKeyDown}/>
                <span onClick={() => handleDeleteTaskset(id)} className="material-icons lightgrey-icon">delete</span>
                </>
            )}
        </div> 
        //TODO: add completion
    )
}

export default Taskset