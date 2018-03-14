import React from 'react';
import { Form, Modal } from 'antd';
import NumericInput from 'components/NumericInput';

const FormItem = Form.Item;

export default Form.create({
  mapPropsToFields(props) {
    return {
      priceRequest: Form.createFormField({
        value: props.priceRequest,
      }),
    };
  },
})((props) => {
  const { modalVisible, form, handleUpdate, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      title="New Price Request"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Request"
      >
        {form.getFieldDecorator('priceRequest', {
            rules: [{ required: true, message: 'Please fill the price' }],
          })(
            <NumericInput placeholder="Please enter updated price request" />
          )}
      </FormItem>
    </Modal>
  );
});
