import { Edge } from "@antv/x6";
import { Button, Descriptions, Divider, Form, InputNumber, Space } from "antd";
import React from "react";

interface EdgeEditorProps {
  edge: Edge;
  onSubmit: (edge: Edge) => void;
  onCancel: () => void;
  onDelete: (edge: Edge) => void;
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
      flowrate: props.edge.data?.flowrate? props.edge.data.flowrate: 0,
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

  return (
    <>
      <Descriptions title="System Info">
        <Descriptions.Item label="Id" span={3}>{props.edge.id}</Descriptions.Item>
        <Descriptions.Item label="From" span={3}>{props.edge.data.source.data.name}</Descriptions.Item>
        <Descriptions.Item label="To" span={3}>{props.edge.data.target.data.name}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <div className="ant-descriptions-header">
        <div className="ant-descriptions-title">User Data</div>
      </div>
      <Form form={form}
        labelCol={{ span: 8 }} layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="Flowrate:" name="flowrate">
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type={'primary'} htmlType="submit">Submit</Button>
            <Button onClick={props.onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
      <Button type={"primary"} danger block onClick={() => props.onDelete(props.edge)}>Delete</Button>
    </>
  );
}