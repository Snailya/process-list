import React from "react";
import { ReactShape } from '@antv/x6-react-shape';
import { Card, Col, Row, Table,  } from "antd";
import { EdgeData, NodeData } from "./data";

export interface ProcessNodeProps {
  node: ReactShape;
}

const columns = [{
  title: "Node",
  dataIndex: 'name',
  key: "name",
}, {
  title: "Value",
  dataIndex: 'value',
  key: "value"
}];

export function ProcessNode(props:ProcessNodeProps) {
  const title = (props.node.data as NodeData).name;
  let inputs = props.node.model?.getIncomingEdges(props.node.id)?.map(edge => {
    const data = edge.data as EdgeData;
    const income = edge.getSourceNode();
    return {
      id: income?.id,
      name: income?.data.name,
      value: data.flowrate
    }
  });
  let outputs = props.node.model?.getOutgoingEdges(props.node.id)?.map(edge => {
    const data = edge.data as EdgeData;
    const outcoming = edge.getTargetNode();
    return {
      id: outcoming?.id,
      name: outcoming?.data.name,
      value: data.flowrate,
    }
  });

  return (
    <Card title={title} headStyle={{textAlign:"center"}} bodyStyle={{padding:0}}>
      <Row gutter={8}>
        <Col span={12}>
          <Table dataSource={inputs} columns={columns} size="small" pagination={false}/>
        </Col>
        <Col span={12}>
          <Table dataSource={outputs} columns={columns} size="small" pagination={false}/>
        </Col>
      </Row>
    </Card>
  )
}