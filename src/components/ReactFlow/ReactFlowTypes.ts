import { Edge, Node } from 'reactflow';

export type ReactFlowWrapperType = HTMLDivElement | null;
export type SelectNodesType = Node[] | null;
export type SelectEdgesType = Edge[] | null;
export type SelectCopyItemType = { nodes: SelectNodesType; edges: SelectEdgesType } | null;
