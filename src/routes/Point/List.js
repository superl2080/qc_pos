import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import QRCode from 'qrcode.react';
import Authorized from '../../utils/Authorized';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const base64Img2Blob = (code) => {
  var parts = code.split(';base64,');
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: contentType}); 
}

const downloadFile = (fileName, content) => {
  var aLink = document.createElement('a');
  var blob = base64Img2Blob(content); //new Blob([content]);
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.dispatchEvent(evt);
} 

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
  const { modalVisible, form, handleAddModalOK, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAddModalOK(fieldsValue);
    });
  };
  const onCancel = () => {
    handleModalVisible(false);
  };
  return (
    <Modal
      title="批量创建点位"
      visible={modalVisible}
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
      <Form.Item
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="状态"
      >
        {form.getFieldDecorator('state', {
          rules: [{ required: true, message: '请选择点位初始状态' }],
        })(
          <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
            <Select.Option value="OPEN">{stateMap['OPEN'].text}</Select.Option>
            <Select.Option value="DEPLOY">{stateMap['DEPLOY'].text}</Select.Option>
          </Select>
        )}
      </Form.Item>
    </Modal>
  );
});

@connect(({ global, point, loading }) => ({
  global,
  point,
  loading: loading.models.point,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'point/getList',
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
        type: 'point/getList',
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
      type: 'point/getList',
      payload: {},
    });
  }

  handleAddModalOK = (fields) => {
    dispatch({
      type: 'point/create',
      payload: fields,
      callback: (result) => {
        result ? message.success('新建点位成功！') : message.error('新建点位发生异常，请联系管理员！')
      },
    });
    this.setState({
      modalVisible: false,
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleBatchMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'download':
        const qrs = document.querySelectorAll('.pointQrcode');
        qrs.forEach(qr => downloadFile(qr.getAttribute('filename'), qr.toDataURL('image/png')));
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
      type: 'point/getList',
      payload: params,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  render() {
    const { global, point: { data }, loading, form: { getFieldDecorator } } = this.props;
    const { selectedRows, modalVisible } = this.state;

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
              <Authorized authority={['ADMIN', 'OPERATOR']} >
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              </Authorized>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Authorized authority={['ADMIN', 'OPERATOR', 'DEVICER']}
                      noMatch={
                        <Dropdown trigger={['click', 'hover']} overlay={
                          <Menu onClick={this.handleBatchMenuClick} selectedKeys={[]}>
                          </Menu>
                        }>
                          <Button>
                            批量操作 <Icon type="down" />
                          </Button>
                        </Dropdown>
                      }>
                      <Dropdown trigger={['click', 'hover']} overlay={
                        <Menu onClick={this.handleBatchMenuClick} selectedKeys={[]}>
                          <Menu.Item key="download">下载二维码</Menu.Item>
                        </Menu>
                      }>
                        <Button>
                          批量操作 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </Authorized>
                  </span>
                )
              }
              <div style={{ display: 'none' }}>
              {
                selectedRows.map(selectedRow => <QRCode key={selectedRow.key} className="pointQrcode" size={256} level="H" filename={selectedRow.name + ".png"} value={global.currentEnv.SIT_URL + "/scan/point/" + selectedRow._id} /> )
              }
              </div>
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
          handleModalVisible={this.handleModalVisible}
          modalVisible={modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
