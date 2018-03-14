import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Icon, Row, Col } from 'antd';
import DescriptionList from 'components/DescriptionList';
import StepsOrder from 'components/StepsOrder';
import OrderTimeline from 'components/OrderTimeline';
import classNames from 'classnames';
import styles from './index.less';
import PageHeaderLayout from './../../../layouts/PageHeaderLayout';
import UpdateSubmission from './UpdateSubmission';
import statusEnum from '../../../utils/orderStatusEnum';

const { Description } = DescriptionList;
const status = ['error', 'process', 'finish', 'wait'];

class Detail extends Component {
  state = {
    history: [],
    stepDirection: 'vertical',
    priceRequest: 0,
    modalVisible: false,
    id: '',
    userButton: false,
    documentButton: false,
    financeButton: false,
    orderButton: false,
    verifyOrderButton: false,
    finishButton: false,
    userStatus: 'wait',
    documentStatus: 'wait',
    financeStatus: 'wait',
    orderStatus: 'wait',
    orderVerifyStatus: 'wait',
    orderFinishStatus: 'wait',
  }


  componentWillReceiveProps(nextProps) {
    const { data, history } = nextProps;

    if (history) {
      this.setState({
        history,
      });
    }

    if (data) {
      const { id, documentStatus, financeStatus, orderStatus, priceRequest } = data;

      const userStatus = () => {
        if (documentStatus >= 2 && financeStatus >= 2) return status[2];
        if (documentStatus === 0 || financeStatus === 0) return status[1];
        return status[2];
      };

      const financeApproveStatus = () => {
        if (documentStatus === 2 && financeStatus === 2) return status[2];
        if (documentStatus < 2) return 'wait';
        return status[financeStatus];
      };

      const waitOrderStatus = () => {
        if (documentStatus === 2 && financeStatus === 2 && orderStatus <= 1) return status[1];
        if (documentStatus === 2 && financeStatus === 2 && orderStatus >= 1) return status[2];
        return status[3];
      };

      const verifyOrderStatus = () => {
        if (documentStatus === 2 && financeStatus === 2 && orderStatus === 2) return status[1];
        if (documentStatus === 2 && financeStatus === 2 && orderStatus >= 3) return status[2];
        if (documentStatus === 2 && financeStatus === 2 && orderStatus === 0) return status[0];

        return status[3];
      };

      const finishOrderStatus = () => {
        if (documentStatus === 2 && financeStatus === 2 && orderStatus === 3) return status[1];
        if (documentStatus === 2 && financeStatus === 2 && orderStatus >= 3) return status[2];
        return status[3];
      };

      this.setState({
        id,
        priceRequest,
        userButton: (documentStatus === 0 || financeStatus === 0),
        documentButton: documentStatus === 1,
        financeButton: (documentStatus === 2 && financeStatus === 1),
        orderButton: (documentStatus === 2 && financeStatus === 2 && orderStatus <= 1),
        verifyOrderButton: (documentStatus === 2 && financeStatus === 2 && orderStatus === 2),
        finishButton: (documentStatus === 2 && financeStatus === 2 && orderStatus === 3),
        userStatus: userStatus(),
        documentStatus: status[documentStatus],
        financeStatus: financeApproveStatus(),
        orderStatus: waitOrderStatus(),
        orderVerifyStatus: verifyOrderStatus(),
        orderFinishStatus: finishOrderStatus(),
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/unsubscribe',
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleUpdate = ({ priceRequest }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        financeStatus: 1,
        status: statusEnum.SUBMISSION_UPDATED,
        priceRequest,
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  verifyDocument = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        documentStatus: 2,
        status: statusEnum.DOCUMENT_APPROVED,
      },
    });
  }

  rejectDocument = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        documentStatus: 0,
        status: statusEnum.DOCUMENT_REJECTED,
      },
    });
  }

  approveFinance = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        financeStatus: 2,
        orderStatus: 1,
        status: statusEnum.FINANCE_APPROVED,
      },
    });
  }

  rejectFinance = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        financeStatus: 0,
        status: statusEnum.FINANCE_REJECTED,
      },
    });
  }

  transferFinance = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        financeStatus: 3,
        type: 1,
      },
    });
  }

  updateOrder = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        orderStatus: 2,
        status: statusEnum.ORDER_STARTED,
      },
    });
  }

  verifyOrder = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        orderStatus: 3,
        status: statusEnum.ORDER_APPROVED,
      },
    });
  }

  rejectOrder = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        orderStatus: 0,
        status: statusEnum.ORDER_REJECTED,
      },
    });
  }

  finishOrder = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateDocument',
      payload: {
        id: this.state.id,
        orderStatus: 4,
        status: statusEnum.ORDER_FINISHED,
      },
    });
  }

  iconTypeSteps = (type, icon) => {
    if (type === 'process') return 'loading';
    else return icon;
  }

  render() {
    const { data } = this.props;
    const { stepDirection, modalVisible } = this.state;
    const content = [];
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        content.push(
          <Description key={key} term={key}>{String(data[key])}</Description>
        );
      }
    }
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        {content}
      </DescriptionList>
    );

    const initialDesc = (
      <div className={classNames(styles.textSecondary, styles.stepDescription)}>
        <Fragment>
          Created
          <Icon type="dingding-o" style={{ marginLeft: 8 }} />
        </Fragment>
        <div className={styles.buttonDiv}>
          {this.state.userButton && <Button className={styles.buttonApprove} onClick={() => this.handleModalVisible(true)} type="primary">Update</Button>}
        </div>
      </div>
    );

    const documentDesc = (
      <div className={styles.stepDescription}>
        <Fragment>
          Document is provided
          <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
          <div className={styles.buttonDiv}>
            {this.state.documentButton && <Button className={styles.buttonApprove} onClick={this.verifyDocument} type="primary">Approved</Button>}
            {this.state.documentButton && <Button className={styles.buttonReject} onClick={this.rejectDocument} type="danger">Reject</Button>}
          </div>
        </Fragment>
      </div>
    );

    const financeDesc = (
      <div className={styles.stepDescription}>
        <Fragment>
          Document is provided
          <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
          <div className={styles.buttonDiv}>
            {this.state.financeButton && <Button className={styles.buttonApprove} onClick={this.approveFinance} type="primary">Approved</Button>}
            {this.state.financeButton && <Button className={styles.buttonReject} onClick={this.rejectFinance} type="danger">Reject</Button>}
          </div>
        </Fragment>
      </div>
    );

    const orderDesc = (
      <div className={styles.stepDescription}>
        <Fragment>
          Document is provided
          <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
          <div className={styles.buttonDiv}>
            {this.state.orderButton && <Button className={styles.buttonApprove} onClick={this.updateOrder} type="primary">Approved</Button>}
          </div>
        </Fragment>
      </div>
    );

    const orderApprovalDesc = (
      <div className={styles.stepDescription}>
        <Fragment>
          Document is provided
          <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
          <div className={styles.buttonDiv}>
            {this.state.verifyOrderButton && <Button className={styles.buttonApprove} onClick={this.verifyOrder} type="primary">Approved</Button>}
            {this.state.verifyOrderButton && <Button className={styles.buttonReject} onClick={this.rejectOrder} type="danger">Reject</Button>}
          </div>
        </Fragment>
      </div>
    );

    const orderSuccessDesc = (
      <div className={styles.stepDescription}>
        <Fragment>
          Document is provided
          <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
          <div className={styles.buttonDiv}>
            {this.state.finishButton && <Button className={styles.buttonApprove} onClick={this.finishOrder} type="primary">Approved</Button>}
          </div>
        </Fragment>
      </div>
    );

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout
        title="Order Detail"
        content={description}
      >
        <Fragment>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={data == null}
                title="Progress"
                style={{ marginBottom: 24 }}
                bordered={false}
              >
                <StepsOrder
                  direction={stepDirection}
                  dataSource={
                    [
                      {
                        key: 1,
                        status: this.state.userStatus,
                        desc: initialDesc,
                        title: 'Submission',
                        icon: 'user',
                      },
                      {
                        key: 2,
                        status: this.state.documentStatus,
                        title: 'Document Verification',
                        desc: documentDesc,
                        icon: 'idcard',
                      },
                      {
                        key: 3,
                        status: this.state.financeStatus,
                        title: 'Finance Approval',
                        desc: financeDesc,
                        icon: 'solution',
                      },
                      {
                        key: 4,
                        status: this.state.orderStatus,
                        title: 'Order Start',
                        desc: orderDesc,
                        icon: 'flag',
                      },
                      {
                        key: 5,
                        status: this.state.orderVerifyStatus,
                        title: 'Order Approval',
                        desc: orderApprovalDesc,
                        icon: 'flag',
                      },
                      {
                        key: 6,
                        status: this.state.orderFinishStatus,
                        title: 'Order Success',
                        desc: orderSuccessDesc,
                        icon: 'smile-o',
                      },
                    ]
                  }
                />
              </Card>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={data == null}
                title="History"
                style={{ marginBottom: 24 }}
                bordered={false}
              >
                <OrderTimeline dataSource={this.state.history} />
              </Card>
            </Col>
          </Row>
        </Fragment>
        <UpdateSubmission
          {...parentMethods}
          modalVisible={modalVisible}
          priceRequest={this.state.priceRequest}
        />
      </PageHeaderLayout>
    );
  }
}

export default connect(({ orderDetail }) => ({
  data: orderDetail.payload,
  history: orderDetail.history,
}))(Detail);

