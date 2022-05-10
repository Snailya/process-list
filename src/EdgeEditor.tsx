import { Edge } from "@antv/x6";
import { Button, Form, Input, Space } from "antd";
import React from "react";

interface EdgeEditorProps {
  edge: Edge;
  onSubmit: (edge: Edge) => void;
  onCancel: () => void;
}

export function EdgeEditor(props: EdgeEditorProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      value: props.edge.data? props.edge.data.value: 0,
    });
  })
  
  const handleFinish = () => {
    let edge = props.edge.updateData({value: form.getFieldValue("value")});
    props.onSubmit(edge);
  };

  return (
    <Form labelCol={{ span: 8 }} layout="vertical"
      form={form}
      onFinish={handleFinish}
    >
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