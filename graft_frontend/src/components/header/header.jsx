import { fetchWithAuth } from '../../api/fecthWrappers'
import './header.css'

function Header(){
    
    const logout = () => {
        localStorage.clear()
        fetchWithAuth()
    }

    return(
        //TODO - add conditional logic for rendering on login
        <div className='header'>
            Graft
            <button onClick={logout} style={{float:'right'}}>Logout</button>
        </div>
    )
}

export default Header