import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addEdge, Connection, Edge, Node, Position, ReactFlowInstance, useEdgesState, useKeyPress, useNodesState } from 'reactflow';
import { ReactFlowWrapperType, SelectCopyItemType, SelectEdgesType, SelectNodesType } from './ReactFlowTypes.ts';

const nodeDefaults = {
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '80%',
    backgroundColor: 'green',
    color: '#fff',
    width: 50,
    height: 50,
  },
};

const initialNodes = [
  { id: '1', position: { x: 100, y: 0 }, data: { label: '1', type: 'sample' }, ...nodeDefaults },
  { id: '2', position: { x: 100, y: 100 }, data: { label: '2', type: 'sample' }, ...nodeDefaults },
  { id: '3', position: { x: 100, y: 200 }, data: { label: '3', type: 'sample' }, ...nodeDefaults },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

let id = initialNodes.length + 1;
const getId = () => `dndnode_${id++}`;

const useReactFlowsHooks = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const cmdAndCPressed = useKeyPress(['Meta+c']);
  const cmdAndVPressed = useKeyPress(['Meta+v']);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const lastNode = useRef(4);
  const reactFlowWrapper = useRef<ReactFlowWrapperType>(null);
  const selectNodesRef = useRef<SelectNodesType>(null);
  const selectEdgesRef = useRef<SelectEdgesType>(null);
  const selectCopyItemRef = useRef<SelectCopyItemType>(null);
  const panMouseXRef = useRef(0);
  const panMouseYRef = useRef(0);

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

      const label = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof label === 'undefined' || !label) {
        return;
      }

      if (!reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        position,
        data: { label: `${label}`, type: 'data' },
        ...nodeDefaults,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onNodeDoubleClick = (_, node: Node) => {
    console.log('Node information:', node);
    // Additional actions on double-click
  };

  const onActiveSelectArea = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.shiftKey;
  };

  const onSelectionChange = (params: { nodes: Node[]; edges: Edge[] }) => {
    selectNodesRef.current = params.nodes;
    selectEdgesRef.current = params.edges;
  };

  const onSelectItemChecker = () => {
    console.log(selectNodesRef.current);
    console.log(selectEdgesRef.current);
  };

  useEffect(() => {
    if (!selectNodesRef.current) {
      return;
    }

    if (selectNodesRef.current.length > 0 && cmdAndCPressed) {
      // 선택한 노드가 있으면 복사한다
      selectCopyItemRef.current = {
        nodes: selectNodesRef.current,
        edges: selectEdgesRef.current,
      };
    }
  }, [cmdAndCPressed]);

  useEffect(() => {
    if (selectCopyItemRef.current?.nodes && cmdAndVPressed) {
      // 복사한 노드가 있으면 붙여넣는다
      console.log(selectCopyItemRef.current);
      const newNodes = selectCopyItemRef.current.nodes.map((node) => ({
        id: getId(),
        position: { x: panMouseXRef.current, y: panMouseYRef.current },
        data: node.data,
        ...nodeDefaults,
      }));
      console.log(newNodes);
      if (newNodes && newNodes.length > 0) {
        setNodes((nds) => [...nds, ...newNodes]);
      }
      lastNode.current = lastNode.current + newNodes.length;
    }
  }, [cmdAndVPressed]);

  const onPanMouseMove = (event: React.MouseEvent) => {
    // console.log(event);
    panMouseXRef.current = event.screenX - event.clientX;
    panMouseYRef.current = event.screenY - event.clientY;
  };

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    reactFlowInstance,
    setReactFlowInstance,
    lastNode,
    reactFlowWrapper,
    selectNodesRef,
    selectEdgesRef,
    onConnect,
    getInfo,
    addData,
    onDragOver,
    onDrop,
    onNodeDoubleClick,
    onActiveSelectArea,
    onSelectionChange,
    onSelectItemChecker,
    onPanMouseMove,
  };
};

export default useReactFlowsHooks;
