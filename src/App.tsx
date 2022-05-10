import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Button, Drawer } from 'antd';
import { NodeEditor } from './NodeEditor';
import { Graph, Shape, Node, DataUri } from '@antv/x6';
import '@antv/x6-react-components/es/menu/style/index.css';
import '@antv/x6-react-components/es/menubar/style/index.css';

function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<Graph>();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [node, setNode] = React.useState<Node>(new Shape.Rect());

  const handleSubmit = React.useCallback((node: Node) => {
    setVisible(false);

    node.setAttrByPath("label/text", node.data.name);
    if (!graphRef.current?.hasCell(node)) {
      graphRef.current?.addNode(node);
    }
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
            name: "SampleNode"
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
                offset: { x: -10, y: 10 },
              },
            },
          ],
        });
        setNode(rect);
        setVisible(true);
      })

      graphRef.current.on("node:dblclick", (args) => {
        setNode(args.node);
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
        <NodeEditor node={node} 
          onSubmit={handleSubmit} 
          onCancel={() => setVisible(false)}
          />
      </Drawer>
    </div>
  );
}

export default App;
