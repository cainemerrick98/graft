import { useReactFlow } from '@xyflow/react'
import './taskmodal.css'
import { useState } from 'react'

function TaskModal({task}){
    
    //TODO: we need to have access to the task!
    return (
        <div className='taskmodal'>
            <div className='modal-title'>
                Edit Task
            </div>
            <form className='taskform'>
                <div className='form-row'>
                    <div className='form-column half-width'>
                        <div>
                            <label htmlFor='completed'>Completed</label>
                            <input type='checkbox' className='form-checkbox'/>
                        </div>
                    </div>
                </div>
                <div className='form-row'>
                    <div className='form-column half-width'>
                        <label htmlFor='title'>Title</label>
                        <input id='title' className='form-input'/>
                    </div>
                </div>
                <div className='form-row'>
                    <div className='form-column full-width'>
                        <label htmlFor='description'>Description</label>
                        <textarea id='description' className='form-textarea'></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TaskModal