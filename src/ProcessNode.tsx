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
    return {
      id: data.source.id,
      name: data.source.name,
      value: data.value,
    }
  });
  let outputs = props.node.model?.getOutgoingEdges(props.node.id)?.map(edge => {
    const data = edge.data as EdgeData;
    return {
      id: data.target.id,
      name: data.target.name,
      value: data.value,
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