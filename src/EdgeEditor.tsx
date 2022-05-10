import { Edge } from "@antv/x6";
import { Button, Form, Input, Space } from "antd";
import React from "react";
import { EdgeData, NodeData } from "./data";

interface EdgeEditorProps {
  edge: Edge;
  onSubmit: (edge: Edge) => void;
  onCancel: () => void;
}

export function EdgeEditor(props: EdgeEditorProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (!props.edge.data) {
      const data: EdgeData = {
        value: 0,
        source: {
          id: props.edge.getSourceCellId(),
          name: (props.edge.getSourceNode()?.data as NodeData).name
        },
        target: {
          id: props.edge.getTargetCellId(),
          name: (props.edge.getTargetNode()?.data as NodeData).name
        }
      };
      props.edge.setData(data);
    }
    const data = props.edge.data as EdgeData;
    form.setFieldsValue({
      id: props.edge.id,
      from: data.source.name,
      to: data.target.name,
      value: data.value,
    });
  })
  
  const handleFinish = () => {
    const data = {
      ...props.edge.data,
      value: form.getFieldValue("value"),
    }
    props.edge.updateData(data);
    props.onSubmit(props.edge);
  };

  return (
    <Form labelCol={{ span: 8 }} layout="vertical"
      form={form}
      onFinish={handleFinish}
    >
      <Form.Item label="Id:" name="id">
        <Input disabled/>
      </Form.Item>
      <Form.Item label="From:" name="from">
        <Input disabled/>
      </Form.Item>
      <Form.Item label="To:" name="to">
        <Input disabled/>
      </Form.Item>
      <Form.Item label="Value:" name="value">
        <Input />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type={'primary'} htmlType="submit">Submit</Button>
          <Button onClick={props.onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}