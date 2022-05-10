import React from 'react';
import { Button, Form, Input, InputNumber, Space } from 'antd';
import { Node } from "@antv/x6";

export interface NodeEditorProps {
  node: Node,
  onSubmit: (node: Node) => void,
  onCancel: () => void,
}

export function NodeEditor(props: NodeEditorProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      name: props.node.data.name,
      position: props.node.getPosition()
    });
  })

  const handleFinish = () => {
    let node = props.node.updateData({name: form.getFieldValue("name")});
    props.onSubmit(node);
  };

  return (
    <Form labelCol={{ span: 8 }} layout="vertical"
      form={form} 
      onFinish={handleFinish}
    >
      <Form.Item label="Name:" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Position:">
        <Input.Group compact>
          <Form.Item name={['position', 'x']}>
            <InputNumber disabled/>
          </Form.Item>
          <Form.Item name={['position', 'y']}>
            <InputNumber disabled/>
          </Form.Item>
        </Input.Group>
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
