import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import { Link } from 'dva/router';
import StandardTable from './../../../components/StandardTable';
import PageHeaderLayout from './../../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['Shutdown', 'Running', 'Online', 'Error'];
const columns = [
  {
    title: 'Requester',
    dataIndex: 'name',
  },
  {
    title: 'Client',
    dataIndex: 'client',
  },
  {
    title: 'Request',
    dataIndex: 'priceRequest',
    sorter: true,
    render: val => `Rp ${val}`,
  },
  {
    title: 'Total',
    dataIndex: 'priceTotal',
    sorter: true,
    render: val => `Rp ${val}`,
    needTotal: true,
  },
  {
    title: 'Start',
    dataIndex: 'dateStart',
  },
  {
    title: 'End',
    dataIndex: 'dateEnd',
  },
  {
    title: 'Actions',
    render: (text, record) => (
      <Fragment>
        <Link to={`${record.id}`}>Details</Link>
      </Fragment>
    ),
  },
];

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="New Rules"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Description"
      >
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(
          <Input placeholder="Please enter" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ orders, loading }) => ({
  data: orders,
  loading: loading.models.orders,
}))
@Form.create()
export default class ListOrder extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetch',
    });
  }

  fetchMore = () => {
    const { data: { lastVisible } } = this.props;
    console.log('lastVisible: ', lastVisible);
    this.props.dispatch({
      type: 'orders/appendFetch',
      payload: lastVisible,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'orders/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'orders/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'orders/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'orders/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'orders/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('Added successfully');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Rule number">
              {getFieldDecorator('no')(
                <Input placeholder="Please enter" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status">
              {getFieldDecorator('status')(
                <Select placeholder="Please choose" style={{ width: '100%' }}>
                  <Option value="0">Shut-down</Option>
                  <Option value="1">Running</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">Search</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>Reset</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Unfold <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Rule number">
              {getFieldDecorator('no')(
                <Input placeholder="Please enter" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status of use">
              {getFieldDecorator('status')(
                <Select placeholder="Please choose" style={{ width: '100%' }}>
                  <Option value="0">Shot-down</Option>
                  <Option value="1">Running</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Number of calls">
              {getFieldDecorator('number')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Updated">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="Please enter updated date" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status of use">
              {getFieldDecorator('status3')(
                <Select placeholder="Please choose" style={{ width: '100%' }}>
                  <Option value="0">Shutdown</Option>
                  <Option value="1">Running</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status of use">
              {getFieldDecorator('status4')(
                <Select placeholder="Please choose" style={{ width: '100%' }}>
                  <Option value="0">Shutdown</Option>
                  <Option value="1">Running</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">Inquire</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>Reset</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Collapse <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { data: { list, lastVisible }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Delete</Menu.Item>
        <Menu.Item key="approval">Batch Approval</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const loadMore = lastVisible ? (
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
          {loading ? <span><Icon type="loading" /> Loading...</span> : 'Load more'}
        </Button>
      </div>
    ) : null;

    return (
      <PageHeaderLayout title="Form Inquiry">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                New Order
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>Bacth operation</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        More <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              footer={loadMore}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
