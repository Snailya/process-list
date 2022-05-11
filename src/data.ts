import { Edge } from "@antv/x6";
import { ReactShape } from "@antv/x6-react-shape";

export interface NodeData {
  /**
   * cell id of the node, used for getting node properties.
   */
  id: string;
  /**
   * the readable label displayed on node.
   */
  name: string;
  /**
   * edges linked with node as inputs, total input value is called by sum edges' value.
   */
  incomings?: string[];
  /**
   * edges lined with node as outputs, total output value is called by sum edges' value.
   */
  outcomings?: string[];
}

export interface EdgeData {
  /**
   * cell id of the edge, used for getting edge properties.
   */
  id: string,
  /**
   * business data indicates flowrate.
   */
  flowrate: number,
  /**
   * node as source.
   */
  source: string,
  /**
   * node as target.
   */
  target: string,
}

export function createNode(x: number, y: number, name?: string) {
  const node =  new ReactShape({
    x: x,
    y: y,
  });
  node.setData({
    id: node.id,
    data: name? name: "Sample",
  })
  return node;
}

export function updateEdgeData(edge: Edge) {
  edge.setData({
    ...edge.data,
    id: edge.id,
    source: edge.getSourceCellId(),
    target: edge.getTargetCellId(),
  });
}
