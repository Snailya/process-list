import { Edge } from "@antv/x6";
import { Button, Descriptions, Divider, Form, Input, Space } from "antd";
import React from "react";
import { EdgeData, NodeData } from "./data";

interface EdgeEditorProps {
  edge: Edge;
  onSubmit: (edge: Edge) => void;
  onCancel: () => void;
}

/**
 * Edge Editor receives an edge and returns a modified edge after submit.
 * @param props 
 * @returns 
 */
export function EdgeEditor(props: EdgeEditorProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      flowrate: props.edge.data.flowrate,
    });
  })
  
  const handleFinish = () => {
    // update edge
    const data = {
      ...props.edge.data,
      flowrate: form.getFieldValue("flowrate"),
    }
    props.edge.updateData(data);
    props.onSubmit(props.edge);
  };

  const fromName = props.edge.getSourceNode()?.data.name;
  const toName = props.edge.getTargetNode()?.data.name;

  return (
    <>
      <Descriptions title="System Info">
        <Descriptions.Item label="Id" span={3}>{props.edge.id}</Descriptions.Item>
        <Descriptions.Item label="From">{fromName}</Descriptions.Item>
        <Descriptions.Item label="To">{toName}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Form form={form}
        labelCol={{ span: 8 }} layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="Flowrate:" name="flowrate">
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type={'primary'} htmlType="submit">Submit</Button>
            <Button onClick={props.onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}