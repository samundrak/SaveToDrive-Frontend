import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Row, Spin } from 'antd';
import { bindActionCreators } from 'redux';
import { fetchPlan } from '../actions/index';
import Plan from '../../components/subscriptions/Plan';

class SubscriptionPlans extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    if (!this.props.plans.length) {
      this.props.actions.fetchPlan().finally(() => {
        this.setState({
          loading: false
        });
      });
    } else {
      // prettier-ignore
      this.setState({ // eslint-disable-line
        loading: false
      });
    }
  }
  render() {
    return (
      <Spin spinning={this.state.loading}>
        <Row gutter={16}>
          {this.props.plans.map((plan) => (
            <Col span={6} key={plan._id}>
              <Plan plan={plan} />
            </Col>
          ))}
        </Row>
      </Spin>
    );
  }
}
SubscriptionPlans.propTypes = {
  // user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  plans: PropTypes.array.isRequired
};
const mapStateToProps = (state) => ({
  user: state.app.user,
  plans: state.app.plans
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ fetchPlan }, dispatch)
});
export default withRouter(connect(mapStateToProps, mapActionToProps)(SubscriptionPlans));
