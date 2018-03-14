import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Timeline, Icon } from 'antd';
import statusEnum from '../../utils/orderStatusEnum';

const { Item } = Timeline;


export default class OrderTimeline extends Component {
    static contextTypes = {
      dataSource: PropTypes.array,
    };

    render() {
      const { dataSource } = this.props;
      const renderTimelines = () => {
        return (
          dataSource.map((item) => {
            return (
              <Item
                dot={<Icon
                  type={statusEnum.properties[item.status].icon}
                  style={{ fontSize: '16px' }}
                />}
                color={statusEnum.properties[item.status].color}
                key={item.id}
              >
                <p>{statusEnum.properties[item.status].name} by {item.displayName}</p>
                <p>{moment(item.timestamp).fromNow()}</p>
              </Item>
            );
          }
          )
        );
      };

      return (
        <Timeline>
          {renderTimelines()}
        </Timeline>
      );
    }
}
