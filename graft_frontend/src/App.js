import './App.css';
import Sidebar from './components/sidebar/sidebar';
import TaskGraph from './components/reactflow/taskgraph';

function App() {
  return (
    <div className="App">
      <Sidebar></Sidebar>
      <TaskGraph></TaskGraph>
    </div>
  );
}

export default App;
