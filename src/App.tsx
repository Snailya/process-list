import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Button, Drawer } from 'antd';
import { NodeEditor } from './NodeEditor';
import { Graph, Node, DataUri, Edge } from '@antv/x6';
import '@antv/x6-react-components/es/menu/style/index.css';
import '@antv/x6-react-components/es/menubar/style/index.css';
import { EdgeEditor } from './EdgeEditor';
import { ProcessNode } from './ProcessNode';
import { ReactShape } from '@antv/x6-react-shape';
import { createNode, updateEdgeData, updateNeighbors, updateNodeData } from './data';

interface ReloadEventArgs {
  reactShape: ReactShape 
}

function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<Graph>();
  const [editorModel, setEditorModel] = React.useState<Node | Edge | null>();

  const makeVisibleIfNew = React.useCallback((reactShape: ReactShape<ReactShape.Properties>) => {
    if (!graphRef.current?.hasCell(reactShape)) {
      reactShape.setComponent(<ProcessNode node={reactShape} />);
      graphRef.current?.addNode(reactShape);

      // // add hooks
      // reactShape.on("reload", (args:ReloadEventArgs) => {
      //   args.reactShape.setComponent(<ProcessNode node={args.reactShape} />);
      // });
    }
  }, []);

  const handleNodeSubmit = React.useCallback((reactShape: ReactShape) => {
    setEditorModel(null);
    makeVisibleIfNew(reactShape);
  }, [makeVisibleIfNew]);

  const handleEdgeSubmit = React.useCallback((edge: Edge) => {
    setEditorModel(null);
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
        height: containerRef.current.offsetHeight,
        keyboard: true,
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta'],
        },
        connecting: {
          router: {name: "manhattan"},
          allowBlank: false,
          allowEdge: false,
          allowLoop: false,
          allowMulti: false,
          allowPort: true,
          allowNode: false,
        },
      });
      graphRef.current.on("blank:dblclick", (args) => {
        setEditorModel(createNode(args.x, args.y));
      });
      graphRef.current.on("node:dblclick", ({node}) => {
        setEditorModel(node);
        node.once("change:data", (args) => {
          updateNeighbors(args.cell as ReactShape);
        })
      });
      graphRef.current.on("edge:dblclick", ({edge}) => {
        setEditorModel(edge);
      });
      graphRef.current.on("edge:connected", ({isNew, edge}) => {
        if (isNew) {
          updateEdgeData(edge);
          setEditorModel(edge);
        }
      });
      graphRef.current.on("edge:change:data", ({edge}) => {
        const fromName = edge.getSourceNode()?.data.name;
        const toName = edge.getTargetNode()?.data.name;
        edge.setLabels([`${fromName} -> ${toName}: ${edge.data.flowrate}`]);

        const incoming = edge.getSourceNode();
        const outcoming = edge.getTargetNode();
        if (incoming)
          updateNodeData(incoming);
        if (outcoming)
          updateNodeData(outcoming);
      });
    }
  }, [])

  let editor: React.ReactNode;
  let title: string;
  let visible: boolean;
  switch (editorModel?.shape) {
    case "react-shape":
      title = "Node Editor";
      editor = (<NodeEditor node={editorModel as ReactShape} onSubmit={handleNodeSubmit} onCancel={() => setEditorModel(null)} />);
      visible = true;
      break;
    case "edge":
      title = "Edge Editor";
      editor = (<EdgeEditor edge={editorModel as Edge} onSubmit={handleEdgeSubmit} onCancel={() => setEditorModel(null)} />);
      visible = true;
      break;
    default:
      title = "";
      editor = null;
      visible = false;
      break;
  }

  return (
    <div>
      <Button onClick={handleExport}>Export</Button>
      <div style={{height:"100vh"}} ref={containerRef} />
      <Drawer placement="right" visible={visible} 
        title={title} onClose={() => setEditorModel(null)}> 
        {editor}
      </Drawer>
    </div>
  );
}

export default App;
