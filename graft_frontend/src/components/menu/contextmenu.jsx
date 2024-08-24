import { useState } from 'react';
import { fetchWithAuth } from '../../api/fecthWrappers';
import './contextmenu.css'
import { useReactFlow } from '@xyflow/react'

function nodeToTask(node, activeTaskset){
    return {
        title:node.data.label,
        x:node.position.x,
        y:node.position.y,
        taskset:activeTaskset

    }
}

function ContextMenu({position, menuType, setContextMenu, setTaskModal, activeTaskset}){
    const {x, y} = position
    const reactFlowInstance = useReactFlow();

    async function handleAddNode(){
        //TODO: find a way to ensure new node had title
        const new_node = {
            id: `${reactFlowInstance.getNodes().length + 1}`, 
            position:reactFlowInstance.screenToFlowPosition(position),
            data:{label:'new task'},
            origin:[0.5, 0.0],
        }

        console.log(nodeToTask(new_node, activeTaskset))
        const options = {
            method:'POST',
            body:JSON.stringify(nodeToTask(new_node, activeTaskset))
        }
        try{
            const response = await fetchWithAuth('/todo/task/', options)
            if(response.ok){
                reactFlowInstance.addNodes(new_node)
                setContextMenu(null)
            }
            else{
                window.alert('Failed')
            }
        }catch(error){
            window.alert(error)
        }
        
    }

    function handleEditTask(){
        setTaskModal(1)
    }

    function handleDeleteNode(){
        console.log('delete')
    }

    function handleContextMenuClick(){
        setContextMenu(null)
    }

    return (
        <div className="context-menu" style={{top:y, left:x}} onClick={handleContextMenuClick}>
            <div className="menu-list">
                <div className="list-title">Menu</div>
                {menuType === 'PANE' && (
                <div className="list-item" onClick={handleAddNode}>Add task</div>
                )}
                {menuType === 'NODE' && (
                <>
                <div className="list-item" onClick={handleEditTask}>Edit task</div>
                <div className="list-item" onClick={handleDeleteNode}>Delete task</div>
                </>
                )}
            </div>
        </div>
    )
}


export default ContextMenu