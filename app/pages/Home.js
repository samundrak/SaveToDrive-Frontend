import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Validator from 'validatorjs';
import renderIf from 'render-if';
import { Message, Grid } from 'semantic-ui-react';
import rules from '../../../server/core/rules/request/guest';
import * as uploadActions from '../actions/UploadActions';
import * as taskActions from '../actions/taskActions';
import * as actions from '../actions/index';
import FileUploadContainer from '../containers/FileUploadContainer';
import TabsContainer from '../../components/TabsContainer';
import toast from '../../Utils/Toast';
import ProtectedPage from './ProtectedPage';
import Activities from '../containers/Activities';
import UserCard from '../containers/UserCard';
import DrivesLists from '../containers/DrivesLists';

class HomePage extends ProtectedPage {
  constructor() {
    super();
    this.state = {};
  }

  handleUrlChange() {
    return () => {
      const validate = new Validator(
        this.props.upload,
        { url: 'required|url' },
        {}
      );
      if (!validate.fails()) {
        this.props.uploadActions.fetchUrlMeta(this.props.upload.url);
      }
    };
  }

  fetchRecentActivities() {
    this.props.actions.getActivites({ limit: 3 });
  }

  fetchStatistics() {
    this.props.actions.getStatistics();
  }

  handleTabChange(index) {
    return (event, { activeIndex }) => {
      this.props.taskActions.changeActiveIndex(activeIndex, index);
    };
  }

  handleUpload() {
    return (event) => {
      event.preventDefault();
      if (!this.props.upload.services.length) {
        return toast('Please choose any one service to upload file.', 'error');
      }
      const validate = new Validator(
        this.props.upload,
        Object.assign(rules.publicUpload, {}),
        {
          'required_with.filename':
            'Please enter filename to change file name.',
          'required_with.email': 'Please enter email to get notified.',
        }
      );
      if (validate.fails()) {
        return this.props.uploadActions.updateErrors(validate.errors.errors);
      }

      const task = {
        isStarted: false,
        upload: this.props.upload,
        uuid: [],
        key: Date.now(),
        activeIndex: 0,
        tabs: this.props.upload.services.map((service) => ({
          isProcessed: false,
          service,
          completed: null,
          progress: {},
        })),
      };
      this.props.taskActions.addNewUploadTask(task);
      return true;
    };
  }

  componentDidMount() {
    if (!this.props.app.activities.length) {
      setTimeout(() => {
        this.fetchRecentActivities();
        this.fetchStatistics();
      }, 2000);
    }
  }

  render() {
    return (
      <Grid.Row columns={1} centered>
        <Grid.Column computer={5} tablet={6} mobile={16}>
          <UserCard
            user={this.props.user}
            statistics={this.props.app.statistics}
          />
          <DrivesLists clouds={this.props.app.drives} />
          <Activities
            loading={this.props.app.loading.activities}
            items={this.props.app.activities}
          />
        </Grid.Column>
        <Grid.Column computer={9} tablet={10} mobile={16}>
          <FileUploadContainer
            handleUrlChange={this.handleUrlChange()}
            handleUpload={this.handleUpload()}
            user={this.props.app.user}
            drives={this.props.app.drives}
            context={this.props.upload}
            actions={this.props.uploadActions}
          />
          {this.props.task.tasks.map((task, index) => (
            <TabsContainer
              index={index}
              actions={this.props.taskActions}
              task={task}
              key={task.key}
              handleTabChange={this.handleTabChange(index)}
            />
          ))}
          {renderIf(!this.props.task.tasks.length)(
            <Message content="No tasks running." />
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

HomePage.propTypes = {
  upload: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  uploadActions: PropTypes.object.isRequired,
  taskActions: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  upload: state.upload,
  app: state.app,
  task: state.task,
  user: state.app.user,
});

const mapActionsToProps = (dispatch) => ({
  uploadActions: bindActionCreators(uploadActions, dispatch),
  taskActions: bindActionCreators(taskActions, dispatch),
  actions: bindActionCreators(actions, dispatch),
});
export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(HomePage)
);
