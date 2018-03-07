import React, { Component } from 'react';
import * as firebase from 'firebase';

import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Button, Row, Col } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';


const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    mobile: '',
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  onMobileValueChange = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { login } = this.props;
    const { verificationId } = login;

    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          verificationId,
        },
      });
    }
  }

  handleRequestSMS = (err, values) => {
    this.renderCaptcha();
    const appVerifier = window.recaptchaVerifier;
    const { type, mobile } = this.state;
    const mobileFormatted = mobile.replace('0', '+62');
    const params = { ...values, mobile: mobileFormatted, appVerifier };
    if (!err) {
      this.props.dispatch({
        type: 'login/captcha',
        payload: {
          ...params,
          type,
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

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

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  renderWarningMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="warning" showIcon />
    );
  }


  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="Email">
            {
              login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage(login.message)
            }
            <UserName name="email" placeholder="Email" />
            <Password name="password" placeholder="Password" />
          </Tab>
          <Tab key="mobile" tab="Phone">

            {
              login.status === 'error' &&
              login.type === 'captcha' &&
              !login.submitting &&
              this.renderWarningMessage(login.message)
            }
            {
              login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('Invalid verification code')
            }
            <Mobile name="mobile" onChange={this.onMobileValueChange} onSendSMS={this.handleRequestSMS} />
            <div className={styles.captcha} id="recaptcha-container" />
            <Captcha name="code" />
          </Tab>
          <div>
            <Checkbox
              checked={this.state.autoLogin}
              onChange={this.changeAutoLogin}
            >Remember
            </Checkbox>
            <a style={{ float: 'right' }} href="">Forget Password</a>
          </div>
          <Submit loading={submitting}>Login</Submit>
          <div className={styles.other}>
            <Row>
              <Col span={12}>
                <Link className={styles.register} to="/user/register">
                  <Button icon="mail"> Register with Email </Button>
                </Link>
              </Col>
              <Col span={12}>
                <Link className={styles.register} to="/user/register-phone">
                  <Button icon="phone" > Register with Phone </Button>
                </Link>
              </Col>
            </Row>

          </div>
        </Login>
      </div>
    );
  }
}
