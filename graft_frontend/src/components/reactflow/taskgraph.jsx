import { ReactFlow, Background, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, ReactFlowProvider} from "@xyflow/react";
import { useState, useRef, useCallback, useEffect } from "react";
import ContextMenu from "../menu/contextmenu";
import TaskModal from "../modal/taskmodal";
import '@xyflow/react/dist/style.css';
import './taskgraph.css'
import { fetchWithAuth } from "../../api/fecthWrappers";

const contextMenus = {
    PANE:'PANE',
    NODE:'NODE',
}



function TaskGraph({activeTaskset}){
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [contextMenu, setContextMenu] = useState(null)
    const [taskModal, setTaskModal] = useState(null)
    const ref = useRef(null)
    const reactFlowInstance = useReactFlow();

    useEffect(() => {
        if(activeTaskset){
            console.log(activeTaskset)
            const getTasks = async (activeTaskset) => {
                const response = await fetchWithAuth(`todo/taskset/${activeTaskset}/`)
                if(response.ok){
                    const tasks = await response.json()
                    console.log(tasks)
                }
            }
            getTasks(activeTaskset)
        }
    }, [activeTaskset])


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
        const viewport = reactFlowInstance.getViewport()
        const reactFlowPosition = reactFlowInstance.screenToFlowPosition({
            x:(click.clientX + reactFlowBounds.left + viewport.x),
            y:(click.clientY + reactFlowBounds.top + viewport.y),
        })
        reactFlowPosition.x *= viewport.zoom
        reactFlowPosition.y *= viewport.zoom
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
                //TODO: change naming convention below
                //Something like onContextMenu & onTaskModal 
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

function TaskGraphWrapper({activeTaskset}) {
    return(
        <ReactFlowProvider>
            <TaskGraph activeTaskset={activeTaskset}></TaskGraph>
        </ReactFlowProvider>
    )
}

export default TaskGraphWrapper