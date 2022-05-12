import React from "react";
import { ReactShape } from '@antv/x6-react-shape';
import { Card, Col, List, Row } from "antd";
import { Edge } from "@antv/x6";

export interface ProcessNodeProps {
  node: ReactShape;
  onClicked: (edge: Edge) => void
}

export function ProcessNode(props:ProcessNodeProps) {
  const name = props.node.data.name;
  const totalIn = props.node.data.incomings.reduce( (prev: number, curr: Edge) => {
    return prev + curr.data.flowrate;
    }, 0);
  const totalOut = props.node.data.outgoings.reduce( (prev: number, curr: Edge) => {
    return prev + curr.data.flowrate;
    }, 0);

  return (
    <Card title={name} headStyle={{textAlign:"center"}} bodyStyle={{padding:4}}>
      <Row gutter={8}>
        <Col span={12}>
          <List dataSource={props.node.data.incomings} size="small"
                style={{height:"100%"}} split
                renderItem={(edge: Edge) => (
                  <List.Item>
                    <a onClick={() => props.onClicked(edge)}>
                      <Row>
                        <Col span={16}>
                          {edge.data.source.data.name}
                        </Col>
                        <Col span={4}>
                          {edge.data.flowrate} 
                        </Col>
                        <Col span={4}>
                          ({edge.data.flowrate/ totalIn * 100}%)
                        </Col>
                      </Row>
                    </a>
                  </List.Item>
                )}
                header={
                  <div className="ant-list-item" style={{padding: "0px 16px"}}>
                    Total: {props.node.data.incomings.reduce( (prev: number, curr: Edge) => {
                      return prev + curr.data.flowrate;
                    }, 0)}
                  </div>
                }
                />
        </Col>
        <Col span={12}>
          <List dataSource={props.node.data.outgoings} size="small"
                style={{height:"100%"}}
                renderItem={(edge: Edge) => (
                  <List.Item>
                    <a onClick={() => props.onClicked(edge)}>
                      <Row>
                        <Col span={16}>
                          {edge.data.target.data.name}
                        </Col>
                        <Col span={4}>
                          {edge.data.flowrate} 
                        </Col>
                        <Col span={4}>
                          ({(edge.data.flowrate/ totalOut * 100).toFixed(1)}%)
                        </Col>
                      </Row>
                    </a>
                  </List.Item>
                )}
                header={
                  <div className="ant-list-item" style={{padding: "0px 16px"}}>
                    Total: {totalOut}
                  </div>
                }
                />
        </Col>
      </Row>
    </Card>
  )
}
