import React from 'react';
import { connect } from 'dva';
import { Form, Button, Alert, Divider, Upload, Icon, message } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import enumStatus from '../../../utils/orderStatusEnum';

const { Dragger } = Upload;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const { file } = info;
    const { status } = file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { validateFields } = form;

    const onPrev = () => {
      dispatch(routerRedux.push('/orders/request'));
    };
    const onValidateForm = (e) => {
      e.preventDefault();
      validateFields((err) => {
        const { client, priceTotal, priceRequest, date } = data;
        const dateStart = date[0].format();
        const dateEnd = date[0].format();
        if (!err) {
          dispatch({
            type: 'order/submitStepForm',
            payload: {
              client,
              priceTotal: Number(priceTotal),
              priceRequest: Number(priceRequest),
              dateStart,
              dateEnd,
              status: enumStatus.SUBMISSION_CREATED,
            },
          });
        }
      });
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="Remember! Data that already submitted cannot be modified, only by Admin"
          style={{ marginBottom: 24 }}
        />
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="Client Name"
        >
          {data.client}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="Date Range"
        >
          {`${data.date[0].format('LL')} - ${data.date[1].format('LL')} `}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="Price Total"
        >
          <span className={styles.money}>{`Rp. ${data.priceTotal}`}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="Price Request"
        >
          <span className={styles.money}>{ `Rp. ${data.priceRequest}` }</span>
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item label="Support Document Upload">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </Dragger>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            Submit
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            Back
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ order, loading }) => ({
  submitting: loading.effects['order/submitStepForm'],
  data: order.step,
}))(Step2);
