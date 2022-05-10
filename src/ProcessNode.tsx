import React from "react";
import { ReactShape } from '@antv/x6-react-shape';
import { Card,  } from "antd";

export interface ProcessNodeProps {
  node?: ReactShape;
  title?: string;
}

export function ProcessNode(props:ProcessNodeProps) {
  return (
    <Card title={props.title} headStyle={{textAlign:"center"}}>
    </Card>
  )
  
}