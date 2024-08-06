import Graft from './components/graft/graft';
import Login from './components/login/login';
import { BrowserRouter, Routes, Route } from "react-router-dom";



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
