import { ReactFlowProvider } from 'reactflow';
import Top from './components/Top/Top.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import ReactFlows from './components/ReactFlow/ReactFlows.tsx';
import './App.css';

function App() {
  return (
    <ReactFlowProvider>
      <Top />
      <main>
        <Sidebar />
        <ReactFlows />
      </main>
    </ReactFlowProvider>
  );
}

export default App;
