import React from 'react';
import { Button, Descriptions, Divider, Form, Input, Space } from 'antd';
import { ReactShape } from '@antv/x6-react-shape';

export interface NodeEditorProps {
  node: ReactShape,
  onSubmit: (node: ReactShape) => void,
  onCancel: () => void,
}

/**
 * Node Editor receives a node and returns a modified node after submit. 
 * Notice that this node might be an orphan node which isn't visible from graph's model.
 * @param props 
 * @returns 
 */
export function NodeEditor(props: NodeEditorProps) {
  const [form] = Form.useForm();

  React.useEffect(() => {   
    form.setFieldsValue({
      name: props.node.data?.name
    });
  })

  const handleFinish = () => {
    // update node
    const data = {
      ...props.node.data,
      name: form.getFieldValue("name"),
    }
    props.node.updateData(data);
    props.onSubmit(props.node);
  };

  return (
    <>
      <Descriptions title="System Info">
        <Descriptions.Item label="Id" span={3}>{props.node.id? props.node.id: ""}</Descriptions.Item>
        <Descriptions.Item label="Position">({props.node.getPosition().x}, {props.node.getPosition().y})</Descriptions.Item>
      </Descriptions>
      <Divider />
      <div className="ant-descriptions-header">
        <div className="ant-descriptions-title">User Data</div>
      </div>
      <Form form={form}
        labelCol={{ span: 8 }} layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="Name:" name="name">
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type={'primary'} htmlType="submit">Submit</Button>
            <Button onClick={props.onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
      <Button type={"primary"} danger block disabled>Delete</Button>
    </>
  );
}
