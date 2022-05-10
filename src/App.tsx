import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Button, Drawer } from 'antd';
import { NodeEditor } from './NodeEditor';
import { Graph, Shape, Node, DataUri, Edge } from '@antv/x6';
import '@antv/x6-react-components/es/menu/style/index.css';
import '@antv/x6-react-components/es/menubar/style/index.css';
import { EdgeEditor } from './EdgeEditor';

enum EditorMode {
  Node = "node",
  Edge = "edge",
}

function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<Graph>();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<EditorMode>();
  const [node, setNode] = React.useState<Node>(new Shape.Rect());
  const [edge, setEdge] = React.useState<Edge>(new Shape.Edge());

  const handleNodeSubmit = React.useCallback((node: Node) => {
    setVisible(false);

    node.setAttrByPath("label/text", node.data.name);
    if (!graphRef.current?.hasCell(node)) {
      graphRef.current?.addNode(node);
    }
  }, []);

  const handleEdgeSubmit = React.useCallback((edge: Edge) => {
    setVisible(false);
    edge.setLabels([{
      attrs: { 
        label: { 
          text: edge.data.value,
        } 
      },
    }]);
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
        }
      });

      graphRef.current.on("blank:dblclick", (args) => {
        const rect = new Shape.Rect({
          x: args.x,
          y: args.y,
          width: 160,
          height: 80,
          shape: "rect",
          data: {
            name: "SampleNode",
          },
          ports: {
            groups: {
              in: {
                position: "left",
                label: {
                  position: "left",
                },
                attrs: {
                  circle: {
                    stroke: '#31d0c6',
                    magnet: true,
                  }
                },
              },
              out: {
                position: "right",
                label: {
                  position: "right",
                },
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
              attrs: {
                text: { 
                  text: "inputs",
                },
              },
            }, {
              id: "outputs",
              group: "out",
              attrs: {
                text: { 
                  text: 'outputs',
                },
              },
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
        setNode(rect);
        setMode(EditorMode.Node);
        setVisible(true);
      });

      graphRef.current.on("node:dblclick", (args) => {
        setNode(args.node);
        setMode(EditorMode.Node);
        setVisible(true);
      });

      graphRef.current.on("edge:dblclick", (args) => {
        setEdge(args.edge);
        setMode(EditorMode.Edge);
        setVisible(true);
      })
    }
  }, [])

  return (
    <div>
      <Button onClick={handleExport}>Export</Button>
      <div style={{height:"100vh"}} ref={containerRef} />
      <Drawer visible={visible} placement="right"
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
