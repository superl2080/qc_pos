import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'user/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { user, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="wechat" tab="微信登录">
            {
              user.code !== 0 &&
              user.type === 'wechat' &&
              !user.submitting &&
              this.renderMessage('尚未绑定微信账号')
            }
            <UserName name="hide" rules={[{required: false}]} type="hidden" prefix="" />
            <Submit loading={submitting}>一键登录</Submit>
          </Tab>
          <Tab key="account" tab="账户密码登录">
            {
              user.code !== 0 &&
              user.type === 'account' &&
              !user.submitting &&
              this.renderMessage('账户或密码错误')
            }
            <UserName name="logid" placeholder="请输入账号.." />
            <Password name="password" placeholder="请输入密码.." />
            <Submit loading={submitting}>登录</Submit>
          </Tab>
        </Login>
      </div>
    );
  }
}
