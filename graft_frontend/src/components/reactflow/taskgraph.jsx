import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, ReactFlowProvider} from "@xyflow/react";
import { useState, useRef, useCallback } from "react";
import ContextMenu from "../menu/contextmenu";
import TaskModal from "../modal/taskmodal";
import '@xyflow/react/dist/style.css';
import './taskgraph.css'

const contextMenus = {
    PANE:'PANE',
    NODE:'NODE',
}

const initialNodes = [
    {
        id: '0',
        type: 'input',
        data: { label: 'Node' },
        position: { x: 0, y: 50 },
      },
]
const initialEdges = []

function TaskGraph(){
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [contextMenu, setContextMenu] = useState(null)
    const [taskModal, setTaskModal] = useState(null)
    const ref = useRef(null)
    const reactFlowInstance = useReactFlow();

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

    function calculatePanePosition(click){
        const reactFlowBounds = ref.current.getBoundingClientRect();
        const reactFlowPosition = reactFlowInstance.screenToFlowPosition({
            x:(click.clientX + reactFlowBounds.left),
            y:(click.clientY + reactFlowBounds.top),
        })
        return reactFlowPosition
    }

    function handlePaneContextMenu(click){
        click.preventDefault()
        const position = calculatePanePosition(click)
        setContextMenu({position:position, menuType:contextMenus.PANE})
        
    }

    function handlePaneClick(click){
        if(contextMenu){
            setContextMenu(null)
        }
        if(taskModal){
            setTaskModal(null)
        }
    }

    function handleNodeContextMenu(click){
        click.preventDefault()
        const position = calculatePanePosition(click)
        setContextMenu({position:position, menuType:contextMenus.NODE, setContextMenu:setContextMenu})
    }

    function handleNodeClick(){
        if(contextMenu){
            setContextMenu(null)
        }
        if(taskModal){
            setTaskModal(null)
        }
    }

    return(
        <div className="taskgraph">
            <ReactFlow 
            ref={ref}
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onPaneContextMenu={handlePaneContextMenu}
            onPaneClick={handlePaneClick}
            onNodeContextMenu={handleNodeContextMenu}
            onNodeClick={handleNodeClick}
            >
                <Background variant="dots"></Background>

            </ReactFlow>
            {contextMenu && (
                <ContextMenu 
                position={contextMenu.position} 
                menuType={contextMenu.menuType} 
                setContextMenu={setContextMenu}
                setTaskModal={setTaskModal}
                ></ContextMenu>
            )}
            {taskModal && (
                <TaskModal id={taskModal.id}></TaskModal>
            )}
        </div>
    )
}

export default () => (
    <ReactFlowProvider>
        <TaskGraph></TaskGraph>
    </ReactFlowProvider>
)