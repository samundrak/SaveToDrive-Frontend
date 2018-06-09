import PropTypes from 'prop-types';
import React from 'react';
import { Header, Grid, Card } from 'semantic-ui-react';
import Drive from '../../components/Drives/Drive';

class DrivesContainer extends React.Component {
  renderDrives() {
    return this.props.drives.map(drive => (
      <Drive
        key={drive.service}
        actions={this.props.actions}
        service={drive}
      />
    ));
  }

  render() {
    return (
      <Grid.Column width={16} doubling stackable>
        <Header as="h2" size="medium">
          <Header.Content>
            Authenticate the drive you want to use.
          </Header.Content>
        </Header>
        <Card.Group stackable>
          {this.renderDrives()}
        </Card.Group>
      </Grid.Column>
    );
  }
}

DrivesContainer.propTypes = {
  drives: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};
export default DrivesContainer;
