import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Drawer } from 'antd';
import { NodeEditor } from './NodeEditor';
import { Graph } from '@antv/x6';

function App() {
  const [visible, setVisible] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  // initial value
  const [config, setConfig] = React.useState({
    name: "TestNode",
    position: {
      x: 100,
      y: 100
    }
  });

  const graphRef = React.useRef<Graph>();
  const handleSubmit = React.useCallback((cfg: any) => {
    console.log(cfg);
    graphRef.current?.addNode({
      ...cfg,
      shape: "rect",
      width: 80,
      height: 40,
      label: cfg.name,
      data: {
        name: cfg.name
      }
    });
  }, [])

  React.useEffect(() => {
    if (containerRef.current) {
      graphRef.current = new Graph({
        container: containerRef.current!,
        grid: true,
        height: containerRef.current.offsetHeight,
      });

      graphRef.current.on("blank:dblclick", (args) => {
        setConfig({
          name: "SampleNode", 
          position: {
            x: args.x,
            y: args.y,
        } });
        setVisible(true);
      })

      graphRef.current.on("node:dblclick", (args) => {
        console.log(args);
        console.log(args.node.getAttrs());
        // todo: better to save info into data, then use get data method
      })
    }
  }, [])

  return (
    <div>
      <div style={{height:"100vh"}} ref={containerRef}></div>
      <Drawer visible={visible} placement="right"
        onClose={() => setVisible(false)}>
        <NodeEditor nodeConfig={config} 
          onSubmit={handleSubmit} 
          onCancel={() => setVisible(false)}
          />
      </Drawer>
    </div>
  );
}

export default App;
