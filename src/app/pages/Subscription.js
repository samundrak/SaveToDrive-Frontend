import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Dimmer, Loader, Table, Header, Message } from 'semantic-ui-react';
import startCase from 'lodash/fp/startCase';
import { withRouter } from 'react-router-dom';
import renderIf from 'render-if';
import { formatDate } from '../../Utils';
import SideLayout from '../../components/SideLayout';
import ProtectedPage from './ProtectedPage';
import { cancelSubscription, subscriptions } from '../../api/app';
import toast from '../../Utils/Toast';

class Subscription extends ProtectedPage {
  constructor() {
    super();
    this.state = {
      subscriptions: [],
      current: {},
      loading: false
    };
    this.cancel = this.cancel.bind(this);
  }

  getSubscriptions() {
    this.setState({ ...this.state, loading: true });
    subscriptions()
      .then((response) => {
        this.setState({
          ...this.state,
          subscriptions: response.data
        });
        this.setCurrentPlan();
      })
      .catch(() => {
        toast('Unable to fetch subscription details.', 'error');
      })
      .finally(() => {
        this.setState({ ...this.state, loading: false });
      });
  }

  setCurrentPlan() {
    if (this.state.subscriptions.length) {
      const current = this.state.subscriptions[this.state.subscriptions.length - 1];
      this.setState({
        ...this.state,
        current
      });
    }
  }

  cancel() {
    cancelSubscription()
      .then(() => {
        this.setState({
          ...this.state,
          current: { ...this.state.current, is_cancelled: true }
        });
        toast('Your subscription has been cancelled');
      })
      .catch(() => {
        toast('We are unable to cancel subscription.');
      });
  }

  componentDidMount() {
    this.getSubscriptions();
  }

  subscriptionTable() {
    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Plan</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Starts At</Table.HeaderCell>
            <Table.HeaderCell>Ends At</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.subscriptions.map((subscription) => (
            <Table.Row key={subscription.subscription_id}>
              <Table.Cell> {startCase(subscription.plan)} </Table.Cell>
              <Table.Cell> ${subscription.price} </Table.Cell>
              <Table.Cell> {formatDate(subscription.starts_at)} </Table.Cell>
              <Table.Cell> {formatDate(subscription.ends_at)} </Table.Cell>
            </Table.Row>
          ))}
          {renderIf(!this.state.subscriptions.length)(
            <Table.Row>
              <Table.Cell colSpan={4}> No any subscriptions found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }

  render() {
    return (
      <SideLayout>
        <div>
          <Header as="h2">
            <Header.Content>Subscriptions</Header.Content>
          </Header>
          <Message>
            <Message.Content>
              <div>
                <span>Current Plan: {startCase(this.state.current.plan)} </span>
                <span>Subscription ends at: {formatDate(this.state.current.ends_at)}</span>
              </div>
              {renderIf(!this.state.current.is_cancelled)(
                <Button compact size="mini" basic color="red" onClick={this.cancel} className="mt-1">
                  Cancel Subscription
                </Button>
              )}
            </Message.Content>
          </Message>
          {renderIf(this.state.current.is_cancelled)(
            <Message warning>
              <Message.Header>You have cancelled your subscription!</Message.Header>
              <p>You wont be able to accesss account when your current subscription expires.</p>
            </Message>
          )}
          <Dimmer active={this.state.loading} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          {this.subscriptionTable()}
        </div>
      </SideLayout>
    );
  }
}

Subscription.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.app.user
});

export default withRouter(connect(mapStateToProps, null)(Subscription));
