import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './ReactFlow.css';

const initialNodes = [
  { id: '1', position: { x: 100, y: 0 }, data: { label: '1', type: 'sample' } },
  { id: '2', position: { x: 100, y: 100 }, data: { label: '2', type: 'sample' } },
  { id: '3', position: { x: 100, y: 200 }, data: { label: '3', type: 'sample' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
let id = 4;
const getId = () => `dndnode_${id++}`;
const ReactFlows = () => {
  const lastNode = useRef(4);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const getInfo = () => {
    console.log(nodes, edges);
  };

  const addData = () => {
    const newData: Node = {
      id: lastNode.current.toString(),
      position: { x: 100, y: 300 },
      data: { label: lastNode.current.toString() },
    };
    setNodes((prev) => [...prev, newData]);
    lastNode.current++;
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}`, type: 'data' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onNodeDoubleClick = (_, node: Node) => {
    console.log('Node information:', node);
    // Additional actions on double-click
  };

  return (
    <div className="react-flow-area" ref={reactFlowWrapper}>
      <div className="react-flow-button-area">
        <button onClick={getInfo}>GetInfo</button>
        <button onClick={addData}>Data추가</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        {/*<Background color="#ccc" variant="dots" />*/}
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default ReactFlows;
