import Graft from './components/graft/graft';
import Login from './components/login/login';
import Header from './components/header/header';
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {
  return (
    //TODO: add unavialble route
    //TODO: add navbar layout across all routes
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/taskgraph' element={<Graft/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
