import { Node, Edge } from "@antv/x6";
import { ReactShape } from "@antv/x6-react-shape";

export interface NodeData {
  seft: Node;
  /**
   * the readable label displayed on node.
   */
  name: string;
  /**
   * edges linked with node as inputs, total input value is called by sum edges' value.
   */
  incomings?: Edge[];
  /**
   * edges lined with node as outputs, total output value is called by sum edges' value.
   */
  outgoings?: Edge[];
}

export interface EdgeData {
  seft: Edge,
  /**
   * business data indicates flowrate.
   */
  flowrate: number,
  /**
   * node as source.
   */
  source: Node,
  /**
   * node as target.
   */
  target: Node,
}

export function createNode(x: number, y: number, name?: string) {
  const node =  new ReactShape({
    x: x,
    y: y,
  });
  node.setData({
    self: node,
    name: name? name: "SampleNode",
    incomings: [],
    outgoings: [],
  })
  return node;
}
