import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Drawer } from 'antd';
import { NodeEditor } from './NodeEditor';
import { Graph, Shape, Node } from '@antv/x6';

function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<Graph>();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [node, setNode] = React.useState<Node>(new Shape.Rect());

  const handleSubmit = React.useCallback((node: Node) => {
    node.setAttrByPath("label/text", node.data.name);
    if (!graphRef.current?.hasCell(node)) {
      graphRef.current?.addNode(node);
    }
  }, []);

  React.useEffect(() => {
    if (containerRef.current) {
      graphRef.current = new Graph({
        container: containerRef.current!,
        grid: true,
        height: containerRef.current.offsetHeight,
      });

      graphRef.current.on("blank:dblclick", (args) => {
        const rect = new Shape.Rect({
          x: args.x,
          y: args.y,
          width: 80,
          height: 40,
          shape: "rect",
          data: {
            name: "SampleNode"
          }
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
