import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Icon, Header, Dimmer, Loader } from 'semantic-ui-react';
import prettySize from 'prettysize';
import renderIf from 'render-if';
import distanceInWords from 'date-fns/distance_in_words';
import startCase from 'lodash/fp/startCase';
import ProtectedPage from './ProtectedPage';
import SideLayout from '../../components/SideLayout';
import { fetchActivities as fetchUploads } from '../../api/app';
import toast from '../../Utils/Toast';
import { formatDate, getMappedIconWithMime } from '../../Utils';

class Uploads extends ProtectedPage {
  constructor() {
    super();
    this.state = {
      activities: [],
      loading: false,
    };
  }

  fetchActivities() {
    this.setState({ ...this.state, loading: true });
    fetchUploads()
      .then(response => {
        this.setState({
          ...this.state,
          activities: response.data,
        });
      })
      .catch(() => {
        toast('Unable to fetch uploads', 'error');
        this.setState({
          ...this.state,
          activities: [],
        });
      })
      .finally(() => {
        this.setState({ ...this.state, loading: false });
      });
  }

  componentDidMount() {
    this.fetchActivities();
  }

  isError(activity) {
    return activity.status === 'FAILED' || activity.status === 'STOPPED';
  }

  renderItems() {
    return this.state.activities.map(activity => (
      <Table.Row key={activity._id} error={this.isError(activity)}>
        <Table.Cell collapsing>
          <Icon name={getMappedIconWithMime(activity.meta.type)} />
          <a target="_blank" rel="noopener noreferrer" href={activity.url}>
            {activity.meta.name}
          </a>
        </Table.Cell>
        <Table.Cell>{activity.meta.type}</Table.Cell>
        <Table.Cell>{prettySize(activity.meta.size)}</Table.Cell>
        <Table.Cell>{startCase(activity.service)}</Table.Cell>
        <Table.Cell>{formatDate(activity.created_at)}</Table.Cell>
        <Table.Cell>{formatDate(activity.end_at)}</Table.Cell>
        <Table.Cell>
          {distanceInWords(activity.created_at, activity.end_at)}
        </Table.Cell>
        <Table.Cell error={this.isError(activity)}>
          {renderIf(this.isError(activity))(<Icon name="attention" />)}
          {activity.status}
        </Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    return (
      <SideLayout>
        <div>
          <Header as="h2">
            <Header.Content>Uploads</Header.Content>
          </Header>
          <Dimmer active={this.state.loading} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          <Table celled size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Size</Table.HeaderCell>
                <Table.HeaderCell>Service</Table.HeaderCell>
                <Table.HeaderCell>Started At</Table.HeaderCell>
                <Table.HeaderCell>Finished At</Table.HeaderCell>
                <Table.HeaderCell>Process Time</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.renderItems()}
              {renderIf(!this.state.activities.length)(
                <Table.Row>
                  <Table.Cell colSpan={8}> No any activities found.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </SideLayout>
    );
  }
}

Uploads.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.app.user,
});

const mapActionsToProps = () => ({});
export default withRouter(connect(mapStateToProps, mapActionsToProps)(Uploads));
