function nodeToTask(node, activeTaskset){
    return {
        title:node.data.label,
        x:node.position.x,
        y:node.position.y,
        taskset:activeTaskset

    }
}

function tasksToNodes(tasks){
    const nodes = tasks.map(task => {
        return {
            id:String(task.id),
            position:{x:task.x, y:task.y},
            data:{label:task.title}
        }
    })
    return nodes
}

function dependenciesToEdges(dependencies){
    const edges = dependencies.map(dependency => {
        return {
            id:String(dependency.id),
            source:String(dependency.parent),
            target:String(dependency.child),
        }
    })
    return edges
}

function edgeToDependency(edge){
    return {
        child:edge.target,
        parent:edge.source
    }
}

export {nodeToTask, tasksToNodes, dependenciesToEdges, edgeToDependency};