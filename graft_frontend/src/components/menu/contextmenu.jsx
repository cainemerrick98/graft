import './contextmenu.css'

function ContextMenu({position, onAddNode}){
    const {x, y} = position

    function handleAddNode(){
        onAddNode(position)
    }

    return (
        <div className="context-menu" style={{top:y, left:x}}>
            <div className="menu-list">
                <div className="list-title">Menu</div>
                <div className="list-item" onClick={handleAddNode}>Add node</div>
            </div>
        </div>
    )
}


export default ContextMenu