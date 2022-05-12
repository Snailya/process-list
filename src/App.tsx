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
import { createNode } from './data';

function App() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<Graph>();
  const [editorModel, setEditorModel] = React.useState<Node | Edge | null>();

  const makeVisibleIfNew = React.useCallback((reactShape: ReactShape<ReactShape.Properties>) => {
    if (!graphRef.current?.hasCell(reactShape)) {
      reactShape.setComponent(<ProcessNode node={reactShape} onClicked={(edge) => setEditorModel(edge)}/>);
      graphRef.current?.addNode(reactShape);
    }
  }, []);

  const handleNodeSubmit = React.useCallback((reactShape: ReactShape) => {
    setEditorModel(null);
    makeVisibleIfNew(reactShape);
  }, [makeVisibleIfNew]);

  const handleEdgeSubmit = React.useCallback((edge: Edge) => {
    setEditorModel(null);
  }, []);

  const handleEdgeDelete = React.useCallback((edge: Edge) => {
    edge.remove();
    setEditorModel(null);
  }, [])

  const handleExport = React.useCallback(() => {
      graphRef.current?.toPNG((dataUri: string) => {
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
      graphRef.current.on("blank:dblclick", ({x, y}) => setEditorModel(createNode(x, y)));
      graphRef.current.on("node:dblclick", ({node}) => setEditorModel(node));
      graphRef.current.on("node:change:data", ({node}) => {
        node.model?.resetCells(node.model.getCells());
      });
      graphRef.current.on("edge:connected", ({edge}) => {
        edge.updateData({
          ...edge.data,
          source: edge.getSourceNode(),
          target: edge.getTargetNode(),
        })

        edge.data.source.data.outgoings.push(edge);
        edge.data.target.data.incomings.push(edge);

        edge.model?.resetCells(edge.model.getCells());

        setEditorModel(edge);
      });
      graphRef.current.on("edge:dblclick", ({edge}) => setEditorModel(edge));
      graphRef.current.on("edge:change:data", ({edge}) => {
        edge.model?.resetCells(edge.model.getCells());      
      });
      graphRef.current.on("edge:removed", ({edge}) => {
        if (edge.data) {
          if (edge.data.source) {
            const source = (edge.data.source.data.outgoings).findIndex((item: Edge) => item.id == edge.id);
            if (source > -1) {
              edge.data.source.data.outgoings.splice(source, 1); 
            }
  
            const model = edge.data.source.model;
            model?.resetCells(model.getCells());
          }
  
          if (edge.data.target) {
            const target = edge.data.target.data.incomings.findIndex((item: Edge) => item.id == edge.id);
            if (target > -1) {
                edge.data.target.data.incomings.splice(target, 1); 
            }
  
            const model = edge.data.target.model;
            model?.resetCells(model.getCells());
          }
        }
      })
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
      editor = (<EdgeEditor edge={editorModel as Edge} onSubmit={handleEdgeSubmit} onCancel={() => setEditorModel(null)} onDelete={handleEdgeDelete}/>);
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
