import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Steps, Icon } from 'antd';

const { Step } = Steps;


export default class StepsOrder extends Component {
    static contextTypes = {
      dataSource: PropTypes.array,
      direction: PropTypes.object,
    };

    iconTypeSteps = (type, icon) => {
      if (type === 'process') return 'loading';
      else return icon;
    }

    render() {
      const { dataSource, direction } = this.props;

      const renderSteps = () => {
        return (
          dataSource.map(item => (
            <Step
              key={item.key}
              status={item.status}
              description={item.desc}
              title={item.title}
              icon={<Icon type={this.iconTypeSteps(item.status, item.icon)} />}
            />
          ))
        );
      };

      return (
        <Steps direction={direction}>
          {renderSteps()}
        </Steps>
      );
    }
}
