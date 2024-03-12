import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap } from 'reactflow';
import useReactFlowsHooks from './useReactFlowsHooks.ts';
import 'reactflow/dist/style.css';
import './ReactFlow.css';

const ReactFlows = () => {
  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    setReactFlowInstance,
    reactFlowWrapper,
    onConnect,
    getInfo,
    addData,
    onDragOver,
    onDrop,
    onNodeDoubleClick,
    onActiveSelectArea,
    onSelectionChange,
    onSelectItemChecker,
    onMouseMove,
  } = useReactFlowsHooks();

  return (
    <div className="react-flow-area" ref={reactFlowWrapper}>
      <div className="react-flow-button-area">
        <button onClick={getInfo}>GetInfo</button>
        <button onClick={addData}>Data추가</button>
        <button onClick={onActiveSelectArea}>영역선택</button>
        <button onClick={onSelectItemChecker}>선택확인</button>
      </div>
      <ReactFlow
        className="react-flow-render"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDoubleClick={onNodeDoubleClick}
        onSelectionChange={onSelectionChange}
        onMouseMove={onMouseMove}
        fitView
      >
        {/*<Background color="#ccc" variant="dots" />*/}
        <Background color="#ccc" variant={BackgroundVariant.Lines} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default ReactFlows;
