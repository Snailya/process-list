export interface NodeData {
  id: string;
  name: string;
}

export interface EdgeData {
  value: number
  source: NodeData,
  target: NodeData,
}
