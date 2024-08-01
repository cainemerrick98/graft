import './App.css';
import Sidebar from './components/sidebar/sidebar';
import TaskGraph from './components/reactflow/taskgraph';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Graft(){
  return(
    <div className='App'>
      <Sidebar/>
      <TaskGraph/>
    </div>
  )
}

function Login(){
  return(
    <div>
      <h1>Login</h1>
      <input type='text' placeholder='username'/><br></br>
      <input type='password' placeholder='password'/><br></br>
      <button>GO</button>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='taskgraph' element={<Graft/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
