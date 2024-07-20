import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, ReactFlowProvider} from "@xyflow/react";
import { useState, useRef, useCallback } from "react";
import ContextMenu from "../menu/contextmenu";
import TaskModal from "../modal/taskmodal";
import '@xyflow/react/dist/style.css';
import './taskgraph.css'


const initialNodes = [
    {
        id: '0',
        type: 'input',
        data: { label: 'Node' },
        position: { x: 0, y: 50 },
      },
]
const initialEdges = []

/**
 * 
 * @param {HTMLElement} element 
 */
function nodeClicked(element){
    return element.classList.contains('react-flow__node')
}

function TaskGraph(){
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [contextMenu, setContextMenu] = useState(null)
    const [taskModal, setTaskModal] = useState(null)
    const reactFlowWrapper = useRef(null)
    const { screenToFlowPosition, getZoom, getViewport } = useReactFlow();

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
      );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
      );
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
      );

    /**
     * @param {Object} position
     */
    function addNode (position) {
        const new_node = {
            id: `${nodes.length}`, 
            position:screenToFlowPosition(position),
            origin:[0.5, 0.0],
        }
        setNodes((nodes) => [...nodes, new_node])
        setContextMenu(null)
    }

    /**
     * 
     * @param {MouseEvent} click 
     */
    function handleContextMenu(click){
        //TODO: if click is on a node menu does not appear in the correct position
        click.preventDefault()
        const zoom = getZoom()
        const react_flow_bounds = click.target.getBoundingClientRect();
        setContextMenu({position:screenToFlowPosition({
            x:click.clientX + react_flow_bounds.left, 
            y:click.clientY + react_flow_bounds.top
        })})
    }

    function handleOnClick(click){
        if(contextMenu){
            setContextMenu(null)
        }
    }

    return(
        <div className="taskgraph" ref={reactFlowWrapper} onContextMenu={handleContextMenu} onClick={handleOnClick}>
            <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            >
                <Background variant="dots"></Background>

            </ReactFlow>
            {contextMenu && (
                <ContextMenu position={contextMenu.position} onAddNode={addNode}></ContextMenu>
            )}
            {taskModal && (
                <TaskModal position={taskModal.position}></TaskModal>
            )}
        </div>
    )
}

export default () => (
    <ReactFlowProvider>
        <TaskGraph></TaskGraph>
    </ReactFlowProvider>
)