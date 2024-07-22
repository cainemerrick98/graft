import './contextmenu.css'
import { useReactFlow } from '@xyflow/react'

function ContextMenu({position, menuType, setContextMenu, setTaskModal}){
    const {x, y} = position
    const reactFlowInstance = useReactFlow();

    function handleAddNode(){
        const new_node = {
            id: `${reactFlowInstance.getNodes().length}`, 
            position:reactFlowInstance.screenToFlowPosition(position),
            origin:[0.5, 0.0],
        }
        reactFlowInstance.addNodes(new_node)
        setContextMenu(null)
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