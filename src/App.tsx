import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Button, Drawer } from 'antd';
import { NodeEditor } from './NodeEditor';
import { Graph, Shape, Node, DataUri, Edge } from '@antv/x6';
import '@antv/x6-react-components/es/menu/style/index.css';
import '@antv/x6-react-components/es/menubar/style/index.css';
import { EdgeEditor } from './EdgeEditor';
import { ProcessNode } from './ProcessNode';
import { ReactShape } from '@antv/x6-react-shape';
import { EdgeData, NodeData } from './data';

function renderNodes(nodes: Node[]) {
  for (let node of nodes) {
    let reactNode = node as ReactShape;
    if (reactNode) {
      if (reactNode.getComponent()) {
        reactNode.removeComponent();
      }
      reactNode.setComponent(<ProcessNode node={reactNode} />);
    }
  }
}

function renderEdge(edge: Edge) {
  const data = edge.data as EdgeData;
  edge.setLabels([{
    attrs: { 
      label: { 
        text: `${data.source.name}-->${data.target.name}: ${data.value}`,
      } 
    },
  }]);
}

enum EditorMode {
  Node = "node",
  Edge = "edge",
}

function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<Graph>();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<EditorMode>();
  const [node, setNode] = React.useState<Node>(new Shape.Empty());
  const [edge, setEdge] = React.useState<Edge>(new Shape.Edge());

  const handleNodeSubmit = React.useCallback((node: Node) => {
    setVisible(false);
    renderNodes([node]);
    if (!graphRef.current?.hasCell(node)) {
      graphRef.current?.addNode(node);
    }
  }, []);

  const handleEdgeSubmit = React.useCallback((edge: Edge) => {
    setVisible(false);
    renderEdge(edge);
  }, []);

  const handleExport = React.useCallback(() => {
      graphRef.current!.toPNG((dataUri: string) => {
        DataUri.downloadDataUri(dataUri, 'process-list.png');
    })
  }, []);

  React.useEffect(() => {
    if (containerRef.current) {
      graphRef.current = new Graph({
        container: containerRef.current!,
        grid: true,
        height: containerRef.current.offsetHeight,
        connecting: {
          allowBlank: false,
          allowEdge: false,
          allowLoop: false,
          allowMulti: false,
          allowPort: true,
          allowNode: false,
          router: {
            name: "manhattan",
          }
        },
      });

      // create node
      graphRef.current.on("blank:dblclick", (args) => {
        const node = new ReactShape({
          x: args.x,
          y: args.y,
          width: 300,
          height: 80,
          shape: "react-shape",
          ports: {
            groups: {
              in: {
                position: "left",
                attrs: {
                  circle: {
                    stroke: '#31d0c6',
                    magnet: true,
                  }
                },
              },
              out: {
                position: "right",
                attrs: {
                  circle: {
                    stroke: '#31d0c6',
                    magnet: true,
                  }
                },
              }
            },
            items: [{
              id: "inputs",
              group: "in",
            }, {
              id: "outputs",
              group: "out",
            }]
          },
          tools: [
            {
              name: 'button-remove',
              args: {
                x: '100%',
                y: 0,
                offset: { 
                  x: -10, 
                  y: 10,
                },
              },
            },
          ],
        });
        setNode(node);
        setMode(EditorMode.Node);
        setVisible(true);
      });

      // edit node
      graphRef.current.on("node:dblclick", (args) => {
        setNode(args.node);
        setMode(EditorMode.Node);
        setVisible(true);
      });

      graphRef.current.on("node:change:data", (args) => {
        console.log("trigger node change data");
        const inputs = args.node.model?.getIncomingEdges(args.node);
        if (inputs) {
          for (let edge of inputs) {
            const data = edge.data as EdgeData;
            edge.updateData({
              ...data,
              target: {
                id: args.node.id,
                name: args.node.data.name
              }
            });
          }
        }

        const outputs = args.node.model?.getOutgoingEdges(args.node);
        if (outputs) {
          for (let edge of outputs) {
            const data = edge.data as EdgeData;
            edge.updateData({
              ...data,
              source: {
                id: args.node.id,
                name: args.node.data.name
              }
            });
          }
        }
      });

      // todo: delete node
      graphRef.current.on("node:removed", (args) => {

      });

      // create edge
      graphRef.current.on("edge:connected", (args) => {
        if (args.isNew) {
          const data: EdgeData = {
            value: 0,
            source: {
              id: args.edge.getSourceCellId(),
              name: (args.edge.getSourceNode()?.data as NodeData).name
            },
            target: {
              id: args.edge.getTargetCellId(),
              name: (args.edge.getTargetNode()?.data as NodeData).name
            }
          }
          args.edge.updateData(data);
        }
      });

      // edit edge
      graphRef.current.on("edge:dblclick", (args) => {
        setEdge(args.edge);
        setMode(EditorMode.Edge);
        setVisible(true);
      });

      graphRef.current.on("edge:change:data", (args) => {
        // force update node
        renderNodes([
          args.edge.getSourceNode()!, 
          args.edge.getTargetNode()!,
        ]);
        renderEdge(args.edge);
      });

      // delete edge
      graphRef.current.on("edge:removed", (args) => {
        renderNodes([args.edge.getSourceNode()!, args.edge.getTargetNode()!]);
      });
    }
  }, [])

  return (
    <div>
      <Button onClick={handleExport}>Export</Button>
      <div style={{height:"100vh"}} ref={containerRef} />
      <Drawer visible={visible} placement="right"
        title={mode === EditorMode.Node? "Node Editor": "Edge Editor"}
        onClose={() => setVisible(false)}> 
        {mode === EditorMode.Node ? (      
            <NodeEditor node={node} 
              onSubmit={handleNodeSubmit} 
              onCancel={() => setVisible(false)}
            />
          ): (
            <EdgeEditor edge={edge} 
              onSubmit={handleEdgeSubmit}
              onCancel={() => setVisible(false)}
            />
          )
        }
      </Drawer>
    </div>
  );
}

export default App;
