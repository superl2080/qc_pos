import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const stateMap = {
  OPEN: {
    text: '待机',
    badge: 'warning',
  },
  DEPLOY: {
    text: '运行中',
    badge: 'success',
  },
  CLOSE: {
    text: '关闭',
    badge: 'default',
  },
};
const columns = [
  {
    title: '点位名',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render(val, data) {
      return <Badge status={stateMap[data.state].badge} text={val} />;
    },
  },
  {
    title: '商户名',
    dataIndex: 'info.shop',
    sorter: (a, b) => a.info.shop.localeCompare(b.info.shop),
  },
  {
    title: '所属合伙人',
    dataIndex: 'partner.name',
    sorter: (a, b) => a.partner.name.localeCompare(b.partner.name),
  },
];

const CreateAddModel = Form.create()((props) => {
  const { addModalVisible, form, handleAddModalOK, handleAddModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAddModalOK(fieldsValue);
    });
  };
  const onCancel = () => {
    handleAddModalVisible(false);
  };
  return (
    <Modal
      title="批量创建点位"
      visible={addModalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form.Item
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="数量"
      >
        {form.getFieldDecorator('count', {
          rules: [{ required: true, message: '请输入需要创建的点位数量' }],
        })(
          <Input placeholder="请输入创建的数量" />
        )}
      </Form.Item>
    </Modal>
  );
});

@connect(({ point, loading }) => ({
  point,
  loading: loading.models.point,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addModalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetch',
    });
  }

  handleFormSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      });

      dispatch({
        type: 'point/fetch',
        payload: fieldsValue,
      });
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'point/fetch',
      payload: {},
    });
  }

  handleAddModalOK = (fields) => {
    message.error('功能还没做完呢！');
    this.setState({
      addModalVisible: false,
    });
  }

  handleAddModalVisible = (flag) => {
    this.setState({
      addModalVisible: !!flag,
    });
  }

  handleBatchMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'download':
        dispatch({
          type: 'point/download',
          payload: {
            piontIds: selectedRows,
          },
        });
        break;
      default:
        break;
    }
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
      type: 'point/fetch',
      payload: params,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  render() {
    const { point: { data }, loading, form: { getFieldDecorator } } = this.props;
    const { selectedRows, addModalVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleFormSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <Form.Item label="关键词">
                      {getFieldDecorator('text')(
                        <Input placeholder="请输入模糊搜索关键词" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label="状&nbsp;&nbsp;&nbsp;&nbsp;态">
                      {getFieldDecorator('state')(
                        <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
                          <Select.Option value="OPEN">{stateMap['OPEN'].text}</Select.Option>
                          <Select.Option value="DEPLOY">{stateMap['DEPLOY'].text}</Select.Option>
                          <Select.Option value="CLOSE">{stateMap['CLOSE'].text}</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <div className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">搜索</Button>
                      <Button onClick={this.handleFormReset}>重置</Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Dropdown overlay={
                      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                        <Menu.Item key="download">打印二维码</Menu.Item>
                      </Menu>
                    }>
                      <Button>
                        批量操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateAddModel
          handleAddModalOK={this.handleAddModalOK}
          handleAddModalVisible={this.handleAddModalVisible}
          addModalVisible={addModalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
