import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, message, Spin } from 'antd';
import * as uploadActions from '../actions/UploadActions';
import * as taskActions from '../actions/taskActions';
import RemoteUploadForm from '../../components/forms/RemoteUploadForm';
import { BULK_UPLOAD_LIMIT } from '../../consts';
import { postAuthUpload } from '../../api/app';
import { upload as uploadRule } from '../../Utils/ValidationRules';
import Uploads from '../../components/Uploads';

class RemoteUpload extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      loading: false
    };
  }

  fieldChange(field) {
    return (event) => {
      const { value } = event.target;
      switch (field) {
        case 'url':
          this.props.actions.updateUrl(value);
          break;
        case 'email':
          this.props.actions.updateEmail(value);
          break;
        case 'filename':
          this.props.actions.updateFilename(value);
          break;
        case 'connections':
          this.props.actions.updateConnections(value);
          break;
        default:
          break;
      }
    };
  }

  handleChange(field) {
    return () => {
      switch (field) {
        case 'isEmail':
          this.props.actions.toggleEmail();
          break;
        case 'isFilename':
          this.props.actions.toggleFileName();
          break;
        default:
          break;
      }
    };
  }
  handleAddUrlField() {
    if (this.props.upload.urls.length >= BULK_UPLOAD_LIMIT) {
      return message.error(`Only ${BULK_UPLOAD_LIMIT} item is allowed on bulk.`);
    }
    return this.props.actions.addNewUrlField();
  }
  handleUrlChanges(id) {
    return (event) => {
      this.props.actions.updateUrl(event.target.value, id);
    };
  }
  handleUrlRemove(id) {
    return () => {
      if (this.props.upload.urls.length === 1) {
        return message.error('There must be atleast 1 item.');
      }
      return this.props.actions.removeUrlField(id);
    };
  }
  handleUpload() {
    const payload = this.props.upload;

    uploadRule
      .validate(payload)
      .then(() => {
        this.setState({
          loading: true
        });
        postAuthUpload(payload)
          .then(({ data = [] }) => {
            if (data && data.length) {
              // Successfull upload valdiation and process
              data.completed = null; // eslint-disable-line
              const tasks = data.map((item) => ({
                ...item,
                completed: null,
                waiting: true
              }));
              tasks[0].waiting = false;
              this.props.taskActions.add(tasks);
              message.success(`${data.length} task(s) has been added.`);
              // this.props.actions.backupUpload();
              this.props.actions.clear();
            }
          })
          .catch((error) => {
            if (error.response) {
              return message.error(error.response.data.message);
            }
            return message.error(error.message);
          })
          .finally(() => {
            this.setState({
              loading: false
            });
          });
      })
      .catch((err) => {
        err.errors.forEach((element) => {
          message.error(element);
        });
      });
  }
  render() {
    return (
      <Row gutter={24}>
        <Col span={15}>
          <Card>
            <h2>Remote Upload</h2>
            <Spin spinning={this.state.loading}>
              <RemoteUploadForm
                connections={this.props.connections}
                upload={this.props.upload}
                handleChange={this.handleChange}
                fieldChange={this.fieldChange}
                handleAddUrlField={this.handleAddUrlField}
                handleUrlChanges={this.handleUrlChanges}
                handleUrlRemove={this.handleUrlRemove}
                handleUpload={this.handleUpload}
              />
            </Spin>
          </Card>
          <Uploads tasks={this.props.tasks.tasks} />
        </Col>
        <Col span={9}>
          <Card>
            <h2>Some Key Points</h2>
            <ul>
              <li>
                If a url is too long and there is an error, please shorten the link. You can <a href="https://bit.ly"> Click Here to Shorten.</a>
              </li>
              <li>If you don&apos;t see any response, then Authenticate once again.</li>
              <li>
                Though, we have access to your files, we do not have any right to touch any of your private files and do not either. The files are
                only uploaded to your drives.
              </li>
              <li>
                Once the uploading has started, you can close the tab and forget about it, the file will continue to upload but you will not see any
                upload status the next time you visit this page.
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    );
  }
}

RemoteUpload.propTypes = {
  upload: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  taskActions: PropTypes.object.isRequired,
  connections: PropTypes.array.isRequired,
  tasks: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  user: state.app.user,
  connections: state.app.connections,
  upload: state.upload,
  tasks: state.task
});

const mapActionToProps = (dispatch) => ({
  actions: bindActionCreators({ ...uploadActions }, dispatch),
  taskActions: bindActionCreators({ ...taskActions }, dispatch)
});
export default withRouter(connect(mapStateToProps, mapActionToProps)(RemoteUpload));
