import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './ReactFlow.css';

const initialNodes = [
  { id: '1', position: { x: 100, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 100, y: 200 }, data: { label: '3' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const ReactFlows = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onNodesChange = (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const getInfo = () => {
    console.log(nodes, edges);
  };

  return (
    <div className="react-flow-area">
      <div className="react-flow-button-area">
        <button onClick={getInfo}>GetInfo</button>
      </div>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default ReactFlows;
