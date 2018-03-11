import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Divider, DatePicker } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'order/saveStepFormData',
            payload: values,
          });
          dispatch(routerRedux.push('/orders/request/confirm'));
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label="Client Name"
          >
            {getFieldDecorator('client', {
              initialValue: data.client,
              rules: [{ required: true, message: 'Please input client name' }],
            })(
              <Input placeholder="Client name" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Date Range"
          >
            {getFieldDecorator('date', {
            initialValue: data.date,
            rules: [{
              required: true, message: 'Please input Date',
            }],
            })(
              <RangePicker style={{ width: '100%' }} placeholder={['Start Date', 'End Date']} />
            )}

          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Price Total"
          >
            {getFieldDecorator('priceTotal', {
            initialValue: data.priceTotal,
            rules: [
              { required: true, message: 'Please input price request' },
              { pattern: /^(\d+)((?:\.\d+)?)$/, message: 'Please enter correct price' },
            ],
          })(
            <Input addonBefore="Rp." placeholder=" input total price requested by client" />
          )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Price Request"
          >
            {getFieldDecorator('priceRequest', {
              initialValue: data.priceRequest,
              rules: [
                { required: true, message: ' input request price by you' },
                { pattern: /^(\d+)((?:\.\d+)?)$/, message: 'Please enter correct price' },
              ],
            })(
              <Input addonBefore="Rp." placeholder=" input total price request by you" />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              Next
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>Instructions</h3>
          <h4>Requesting Order</h4>
          <p>Vendor must provide all necessary data</p>
          <h4>Review by Team</h4>
          <p>After all data is recorded, order will be reviewed by team</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ order }) => ({
  data: order.step,
}))(Step1);

