import React, { Component } from 'react';
import * as firebase from 'firebase';


import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import styles from './RegisterPhone.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    prefix: '62',
    type: 'mobile',
    mobile: '',
  };

  componentWillReceiveProps(nextProps) {
    const account = this.props.form.getFieldValue('username');
    if (nextProps.register.status === 'ok') {
      this.props.dispatch(routerRedux.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      }));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onMobileValueChange = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  }

  onGetCaptcha = (err, values) => {
    this.handleRequestSMS(err, values);
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  handleRequestSMS = (err, values) => {
    this.renderCaptcha();
    const appVerifier = window.recaptchaVerifier;
    const { type, mobile, prefix } = this.state;
    const mobileFormatted = `+${prefix}${mobile}`;
    const params = { ...values, mobile: mobileFormatted, appVerifier };
    // console.log(params);

    try {
      this.props.dispatch({
        type: 'register/captcha',
        payload: {
          ...params,
          type,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { register } = this.props;
    const { verificationId } = register;

    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix: this.state.prefix,
            type: this.state.type,
            verificationId,
          },
        });
      }
    });
  };

  changePrefix = (value) => {
    this.setState({
      prefix: value,
    });
  };

  renderCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      expiredcallback: () => {},
    });

    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix } = this.state;
    return (
      <div className={styles.main}>
        <h3>Register Account</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username！',
                },
              ],
            })(<Input size="large" placeholder="Username" />)}
          </FormItem>
          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="62">+62</Option>
              </Select>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: 'Plaese enter your phone number！',
                  },
                  {
                    pattern: /^8\d{10}$/,
                    message: 'Malformed phone number！',
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '80%' }}
                  onChange={this.onMobileValueChange}
                  placeholder="phone number"
                />
              )}
            </InputGroup>
          </FormItem>
          <div className={styles.captcha} id="recaptcha-container" />
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter verification code！',
                    },
                  ],
                })(<Input size="large" placeholder="Verification code" />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : 'Send SMS'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              Register
            </Button>
            <Link className={styles.login} to="/user/login">
              Login to existing account
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
