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
  { id: 'dndnode_1', position: { x: 100, y: 0 }, data: { label: '1', type: 'sample' }, ...nodeDefaults },
  { id: 'dndnode_2', position: { x: 100, y: 100 }, data: { label: '2', type: 'sample' }, ...nodeDefaults },
  { id: 'dndnode_3', position: { x: 100, y: 200 }, data: { label: '3', type: 'sample' }, ...nodeDefaults },
];
const initialEdges = [{ id: 'dndedge_1_2', source: 'dndnode_1', target: 'dndnode_2' }];

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
  const nodeIndexGapRef = useRef(0);

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

  // 선택된 노드들의 정보가 변경되면 useRef 갱신용
  const onSelectionChange = (params: { nodes: Node[]; edges: Edge[] }) => {
    selectNodesRef.current = params.nodes;
    selectEdgesRef.current = params.edges;
  };

  // 선택된 노드들 체크용 --- 임시
  const onSelectItemChecker = () => {
    console.log(selectNodesRef.current);
    console.log(selectEdgesRef.current);
  };

  // 사용자의 마우스 좌표값을 기억하기 위한 마우스 이동 감지 이벤트
  const onMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const canvasPosition = reactFlowInstance?.screenToFlowPosition({ x: clientX, y: clientY });
    if (canvasPosition) {
      panMouseXRef.current = canvasPosition.x;
      panMouseYRef.current = canvasPosition.y;
    }
  };

  // 복사 커맨드 조합이 눌리는 경우 감지 이벤트를 처리하는 useEffect
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

  // 붙여넣기 커맨드 조합이 눌리는 경우 감지 이벤트를 처리하는 useEffect
  useEffect(() => {
    // Nodes 붙여넣기
    if (selectCopyItemRef?.current?.nodes && cmdAndVPressed) {
      // 복사한 노드가 있으면 붙여넣는다
      const firstNodePosition = { x: 0, y: 0 }; // 복사 노드 리스트중 첫번쨰 노드의 위치를 기억한다
      const newNodes = selectCopyItemRef.current.nodes.map((node, idx) => {
        const position = { x: panMouseXRef.current, y: panMouseYRef.current };

        // 첫번째 노드이면 위치 정보를 기억한다
        if (idx === 0) {
          nodeIndexGapRef.current = id - parseInt(node.id.replace('dndnode_', ''), 10);
          firstNodePosition.x = node.position.x;
          firstNodePosition.y = node.position.y;
        }

        // 두번째 노드부터 첫번째 노드에서 위치의 값을 뺀다
        if (idx > 0) {
          position.x = position.x + node.position.x - firstNodePosition.x;
          position.y = position.y + node.position.y - firstNodePosition.y;
        }

        return {
          id: getId(),
          position,
          data: node.data,
          style: node.style,
        };
      });
      if (newNodes && newNodes.length > 0) {
        setNodes((nds) => [...nds, ...newNodes]);
      }
      lastNode.current = lastNode.current + newNodes.length;
    }

    // Edges 붙여넣기
    if (selectCopyItemRef?.current?.edges && cmdAndVPressed) {
      const newEdges = selectCopyItemRef.current.edges.map((edge) => {
        const source = nodeIndexGapRef.current + parseInt(edge.source.replace('dndnode_', ''), 10);
        const target = nodeIndexGapRef.current + parseInt(edge.target.replace('dndnode_', ''), 10);

        return {
          ...edge,
          id: `dndedge_${source}_${target}`,
          source: `dndnode_${source}`,
          target: `dndnode_${target}`,
        };
      });
      if (newEdges && newEdges.length > 0) {
        setEdges((edges) => [...edges, ...newEdges]);
      }
    }
  }, [cmdAndVPressed]);

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
    onMouseMove,
  };
};

export default useReactFlowsHooks;
