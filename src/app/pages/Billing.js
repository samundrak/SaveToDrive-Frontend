import PropTypes from 'prop-types';
import React from 'react';
import { Segment, Dimmer, Loader, Button, Header } from 'semantic-ui-react';
import braintree from 'braintree-web-drop-in';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllPlans as fetchPlans, updatePayment, getBraintreeClientToken } from '../../api/app';
import toast from '../../Utils/Toast';
import ProtectedPage from './ProtectedPage';
import SideLayout from '../../components/SideLayout';

class Billing extends ProtectedPage {
  constructor() {
    super();
    autoBind(this);
    this.instance = null;
    this.plans = [];
    this.state = {
      paymentContainer: 'paymentContainer',
      clientToken: null,
      loading: true,
      plan: {},
    };
  }

  UNSAFE_componentWillMount() {
    return this.getAllPlans();
  }

  setInstance(instance) {
    this.instance = instance;
  }

  getAllPlans() {
    fetchPlans()
      .then(({ data }) => {
        this.plans = data.plan;
        this.setState({ ...this.state, plan: data.plans[0] });
        this.getClientToken();
      })
      .catch(() => {
        toast('We are unable to fetch plans, please try again.', 'error');
      });
  }

  getClientToken() {
    getBraintreeClientToken()
      .then(({ data }) => {
        this.setState({
          ...this.state,
          clientToken: data.token,
        });
        this.initPaymentContainer();
      })
      .catch(() => {
        toast('Unable to connect with payment gateway, Please try again.', 'error');
      });
  }

  handlePayment() {
    if (!this.instance) {
      toast('Unable to proceed payment.', 'error');
      return false;
    }

    this.enableLoading();
    return this.instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
      // Submit payload.nonce to your server
      this.disableLoading();
      if (requestPaymentMethodErr) {
        return toast(requestPaymentMethodErr.message, 'error');
      }

      this.enableLoading();
      updatePayment({ nonce: payload.nonce })
        .then(() => {
          toast('Payment details changed successfully.');
        })
        .catch((error) => {
          if (error.response && error.response.data.message) {
            return toast(error.response.data.message, 'error');
          }

          return toast('Some problem occurred, please try again.');
        })
        .finally(() => {
          this.disableLoading();
        });
      return true;
    });
  }

  enableLoading() {
    this.setState({
      ...this.state,
      loading: true,
    });
  }

  disableLoading() {
    this.setState({
      ...this.state,
      loading: false,
    });
  }

  initPaymentContainer() {
    this.disableLoading();
    braintree.create({
      authorization: this.state.clientToken,
      container: `#${this.state.paymentContainer}`,
      paypal: {
        flow: 'vault',
      },
    }, (error, instance) => {
      if (error) {
        return toast('Unable to setup payment form, please try again.', 'error');
      }

      return this.setInstance(instance);
    });
  }

  render() {
    return (
      <SideLayout text>
        <div>
          <Header textAlign="center" as="h2" attached="top">
            Billing Information
          </Header>
          <Segment attached>
            <Dimmer active={this.state.loading} inverted>
              <Loader size="large">Loading</Loader>
            </Dimmer>
            <div id={`${this.state.paymentContainer}`} />
            <Button onClick={this.handlePayment}>
              Update Billing
            </Button>
          </Segment>
        </div>
      </SideLayout>
    );
  }
}


Billing.propTypes = {
  user: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.app.user,
});

const mapActionsToProps = () => ({});
export default withRouter(connect(mapStateToProps, mapActionsToProps)(Billing));
