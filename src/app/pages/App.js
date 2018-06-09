/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import autobind from 'auto-bind';
import { bindActionCreators } from 'redux';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Avatar, Dropdown } from 'antd';
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import isPast from 'date-fns/is_past';
import startCase from 'lodash/fp/startCase';
import renderIf from 'render-if';
import STDHeader from '../../components/Header';
import STDFooter from '../../components/common/Footer';
import { getQueryString, firstLetters } from '../../Utils';
import { fetchServices, fetchConnections, updateConnection } from '../actions';
import { add as addTask } from '../actions/taskActions';
import { getUploadInQueue } from '../../api/app';
import Home from './Home';
import Logout from './Logout';
import Me from './Me';
import Drives from './Drives';
import Payment from './Payment';
import Subscription from './Subscription';
import Billing from './Billing';
import Uploads from './Uploads';
import AppLogo from '../../components/AppLogo';
import PrivateRoute from '../../components/PirvateRoute';
import Connection from './Connection';
import RemoteUpload from './RemoteUpload';
import SubscriptionPlans from './SubscriptionPlans';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false
    };
    autobind(this);
  }

  toggle(collapsed) {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  componentDidMount() {
    this.listenCloudAuthenticationPopup();
    this.props.actions.fetchServices();
    this.props.actions.fetchConnections();
    this.loadInQueueUploads();
  }

  loadInQueueUploads() {
    getUploadInQueue().then(({ data = [] }) => {
      if (data && data.length) {
        // Successfull upload valdiation and process
        data.completed = null; // eslint-disable-line
        const tasks = data.map((item) => ({
          ...item,
          completed: null,
          waiting: true
        }));
        tasks[0].waiting = false;
        this.props.actions.addTask(tasks);
      }
    });
  }
  // UNSAFE_componentWillUpdate(nextProps) {
  // if (
  //   this.isNotSubscribed(nextProps.user) &&
  //   this.props.history.location.pathname !== '/payment'
  // ) {
  //   return this.props.history.push('/payment');
  // }
  // return false;
  // }

  listenCloudAuthenticationPopup() {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type !== 'CLOSE') {
          return false;
        }

        let connection = getQueryString('connection', event.data.query);
        connection = JSON.parse(decodeURIComponent(connection));
        connection.status = true;
        this.props.actions.updateConnection(connection._id, connection);
        event.source.close();
        return true;
      },
      false
    );
  }

  isNotSubscribed(user = {}) {
    return user.subscription && isPast(user.subscription.ends_at);
  }

  getProfileMenu(user) {
    return (
      <Menu>
        <Menu.Item>
          <Link to="/me" className="item">
            <span> Profile</span>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a href="/api/logout">Log Out</a>
        </Menu.Item>
      </Menu>
    );
  }

  getDefaultKey() {
    return {};
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <Link to="/" className="item">
            <div className="app logo" />
          </Link>
          <Menu theme="dark" defaultSelectedKeys={[pathname]} mode="inline">
            <Menu.Item key="/remote-upload">
              <Link to="/remote-upload" className="item">
                <Icon type="cloud-upload-o" />
                <span> Remote Upload</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/connections">
              <Link to="/connections" className="item">
                <Icon type="link" />
                <span> Connections</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row type="flex" justify="space-between">
              <Col span={1}>
                <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
              </Col>
              <Col span={3}>
                <Dropdown overlay={this.getProfileMenu()}>
                  <span className="ant-dropdown-link">
                    <Avatar style={{ backgroundColor: '#F2711D' }}>
                      {firstLetters(`${this.props.user.first_name} ${this.props.user.last_name}`)}
                    </Avatar>{' '}
                    {startCase(this.props.user.first_name)}
                    <Icon type="caret-down" style={{ fontSize: '.5rem', marginLeft: '.5rem', verticalAlign: 'middle' }} />
                  </span>
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: '1rem', maxWidth: '1200px' }}>
            <Switch>
              <Route path="/me" component={Me} />
              <Route path="/subscribe" component={SubscriptionPlans} />
              <PrivateRoute user={this.props.user} path="/connections" component={Connection} />
              <PrivateRoute user={this.props.user} path="/remote-upload" component={RemoteUpload} />
              <PrivateRoute user={this.props.user} exact path="/" component={RemoteUpload} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <STDFooter />
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  // history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  drives: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.app.user,
  drives: state.app.drives
});

function mapActionsToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        fetchConnections,
        fetchServices,
        updateConnection,
        addTask
      },
      dispatch
    )
  };
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(App));
