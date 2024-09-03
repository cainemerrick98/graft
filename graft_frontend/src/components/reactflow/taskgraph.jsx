import { ReactFlow, Background, applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow, ReactFlowProvider} from "@xyflow/react";
import { useState, useRef, useCallback, useEffect } from "react";
import ContextMenu from "../menu/contextmenu";
import TaskModal from "../modal/taskmodal";
import TaskNode from "../task/tasknode";
import '@xyflow/react/dist/style.css';
import './taskgraph.css'
import '../task/tasknode.css'
import { fetchWithAuth } from "../../api/fecthWrappers";
import { nodeToTask, edgeToDependency, tasksToNodes, dependenciesToEdges } from "../../api/objectConverters";

const contextMenus = {
    PANE:'PANE',
    NODE:'NODE',
}

const nodeTypes = {
    'task':TaskNode
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
                    const taskset = await response.json()
                    const nodes = tasksToNodes(taskset.tasks)
                    const edges = dependenciesToEdges(taskset.dependencies)
                    setNodes(nodes)
                    setEdges(edges)
                }
            }
            getTasks(activeTaskset)
        }
    }, [activeTaskset])


    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
      );
    
    const handleNodeDragStop = useCallback(
        (event, node) => {
            updateNodePosition(node.id, node.position)
        },
        []
    )

    const updateNodePosition = async (id, position) => {
        try{
            const response = await fetchWithAuth(`/todo/task/${id}/`, {
                method:'PATCH',
                body:JSON.stringify({
                    x:position.x,
                    y:position.y,
                })
            })
            if(! response.ok){
                const data = await response.json()
                console.log(data)
                console.error('failed to update position')
            }
        } catch(error){
                console.error(error)
        }
    }

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
      );
      
    const finishConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
      );
    
    const handleOnConnect = async(params) => {
        const dependency = edgeToDependency(params)
        const options = {
            method:'POST',
            body:JSON.stringify(dependency)
        }
        
        try{
            const response = await fetchWithAuth('todo/dependency/', options)
            if(response.ok){
                finishConnect(params)
            }else{
                window.alert('Bad response')
            }
        }
        catch(error){
            window.alert(error)
        }
    }

    const handleDeleteEdge = async(edges) => {
        const options = {
            method:'DELETE',
        }
        try{
            const response = await fetchWithAuth(`todo/dependency/${edges[0].id}/`, options)
            if(response.ok){
                console.log('deleted edge')
            }else{
                window.alert('Bad response')
            }
        }
        catch(error){
            window.alert(error)
        }
    }

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
        console.log(position)
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
            onEdgesDelete={handleDeleteEdge}
            onConnect={handleOnConnect}
            onPaneContextMenu={handlePaneContextMenu}
            onPaneClick={handlePaneClick}
            onNodeContextMenu={handleNodeContextMenu}
            onNodeClick={handleNodeClick}
            onNodeDragStop={handleNodeDragStop}
            nodeTypes={nodeTypes}
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
                activeTaskset={activeTaskset}
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