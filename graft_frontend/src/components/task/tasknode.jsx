import { useEffect, useRef, useState} from 'react';
import { Handle, Position } from '@xyflow/react';
import { fetchWithAuth } from '../../api/fecthWrappers';
 
 
function TaskNode({data, id}) {
  const [edit, setEdit] = useState(false)
  const [title, setTitle] = useState(data.label)
  const [completed, setCompleted] = useState(data.completed)
  const inputRef = useRef(null)

  useEffect(() => {
      if (edit && inputRef.current) {
        inputRef.current.focus() 
        inputRef.current.select()
      }
    }, [edit]
  )

  const handleSetEdit = () => {
    setEdit((prevEdit) => !prevEdit)
  }

  const handleInputChange = (e) => {
    setTitle(e.target.value)
  }

  //TODO: handle name cannot be empty
  const handleOnBlur = () => {
    handleSetEdit()
    saveTaskTitle()
  }

  const saveTaskTitle = async () => {
    
    const options = {
      method:'PATCH',
      body:JSON.stringify({title:title})
    }

    try{
        const response = await fetchWithAuth(`todo/task/${id}/`, options)
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

  const handleCompleteTaskChange = (e) => {
    setCompleted((prevCompleted) => !prevCompleted)
    updateCompletedStatus()
  }

  const updateCompletedStatus = async () => {
    const options = {
      method:'PATCH',
      body:JSON.stringify({completed:!completed}) //still using previous state
    }

    try{
        const response = await fetchWithAuth(`todo/task/${id}/`, options)
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

  const handleMouseEnter = () => {
    return
  }
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div 
      className='react-flow__node-output'
      onDoubleClick={handleSetEdit}
      onMouseEnter={handleMouseEnter}
      > 
      {!edit && (
          <>
          {title}
          </>
      )}
      {edit && (
          <>
          <input value={title} ref={inputRef} onChange={handleInputChange} onBlur={handleOnBlur} className='task-name-input'/>
          </>
      )}
        
      </div>
      <Handle type="source" position={Position.Bottom} />
      <input type='checkbox' className='complete-task' onChange={handleCompleteTaskChange} checked={completed ? true : false}/>
    </>
  );
}

export default TaskNode