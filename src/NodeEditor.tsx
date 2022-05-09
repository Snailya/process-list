import React from 'react';
import { Button, Form, Input, InputNumber, Space } from 'antd';

export interface NodeEditorProps {
  nodeConfig: { 
    name: string; 
    position: { 
      x: number; 
      y: number; 
    }; 
  },
  onSubmit: (cfg: any) => void,
  onCancel: () => void,
}

export function NodeEditor(props: NodeEditorProps) {
  const [form] = Form.useForm();
  
  React.useEffect(() => {
    form.setFieldsValue(props.nodeConfig);
  })

  return (
    <Form labelCol={{ span: 8 }} layout="vertical"
      form={form} initialValues={props.nodeConfig}
      onFinish={() => props.onSubmit(form.getFieldsValue())}
    >
      <Form.Item label="Name:" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Position:">
        <Input.Group compact>
          <Form.Item name={['position', 'x']}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={['position', 'y']}>
            <InputNumber />
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
