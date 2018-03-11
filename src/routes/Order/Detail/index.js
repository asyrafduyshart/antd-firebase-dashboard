import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import PageHeaderLayout from './../../../layouts/PageHeaderLayout';

class Detail extends PureComponent {
  render() {
    const { data } = this.props;
    const content = [];
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>
        );
      }
    }
    return (
      <PageHeaderLayout title="Order Detail" content="Create order request tobe verified by finance to proceed">
        <div className="content-inner">
          <div className={styles.content}>
            {content}
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ orderDetail }) => ({
  data: orderDetail.payload,
}))(Detail);

