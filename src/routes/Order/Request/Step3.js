import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  render() {
    const { dispatch, data } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/orders/request'));
    };

    const toOrderDetail = () => {
      dispatch(routerRedux.push(`/orders/${data.id}`));
    };

    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={8} className={styles.label}>Client：</Col>
          <Col span={16}>{data.client}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>Date：</Col>
          <Col span={16}>{`${data.dateStart} - ${data.dateEnd}`}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>Total Price：</Col>
          <Col span={16}>Rp <span className={styles.money}>{data.priceTotal}</span></Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>Requested Payment：</Col>
          <Col span={16}>Rp <span className={styles.money}>{data.priceRequest}</span></Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          Make another Order
        </Button>
        <Button onClick={toOrderDetail} >
          Check your Order
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="Creating Order Success"
        description="Order now will be in review by finance team"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ order }) => ({
  data: order.step,
}))(Step3);
