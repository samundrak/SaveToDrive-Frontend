import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import DrivesContainer from '../containers/DrivesContainer';
import SideLayout from '../../components/SideLayout';
import { pingService } from '../actions/DriveActions';
import ProtectedPage from './ProtectedPage';

class Drives extends ProtectedPage {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <SideLayout>
        <DrivesContainer
          drives={this.props.drives}
          actions={this.props.actions}
        />
      </SideLayout>
    );
  }
}

Drives.propTypes = {
  drives: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    drives: state.app.drives,
    user: state.app.user,
  };
}

function mapActionsToProps(dispatch) {
  return {
    actions: bindActionCreators({
      pingService,
    }, dispatch),
  };
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Drives));
