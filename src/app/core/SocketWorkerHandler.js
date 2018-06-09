import autobind from 'auto-bind';
import { message as m } from 'antd';
import SocketWorker from '../../workers/socket.worker';
import { UPLOAD_SUCCESS, UPLOAD_FAILED, UPLOAD_LOGS, UPLOAD_PROGRESS } from '../../consts';
import { uploadItemSuccess, updateItemProgress, uploadItemFailed } from '../actions/taskActions';

class SocketWorkerHandler {
  constructor(store) {
    autobind(this);
    this.worker = new SocketWorker();
    this.store = store;
    console.log(this.worker);
  }

  listen() {
    this.worker.postMessage({
      type: 'init',
      data: {
        host: window.location.host
      }
    });
    this.worker.onmessage = this.handleWorkerMessage;
  }

  handleWorkerMessage(message) {
    const { type, data } = message.data;
    console.log(type, data);
    switch (type) {
      case UPLOAD_SUCCESS:
        this.onUploadSuccess(data);
        break;
      case UPLOAD_LOGS:
        this.onUploadLogs(data);
        break;
      case UPLOAD_FAILED:
        this.onUploadFailed(data);
        break;
      case UPLOAD_PROGRESS:
        this.onUploadProgress(data);
        break;
      default:
        break;
    }
  }
  onUploadProgress({ uuid, progress }) {
    this.store.dispatch(updateItemProgress(uuid, progress));
  }

  onUploadLogs({ type, message }) {
    if (m[type] && message) {
      m[type](message);
    }
  }

  onUploadFailed({ uuid, message }) {
    // eslint-disable-line
    // this.store.dispatch(taskProcessed(uuid));
    this.store.dispatch(uploadItemFailed(uuid, message));
    // this.processFiles(uuid);
    // toast(message, 'error');
    m.error(message);
  }

  onUploadSuccess({ uuid, result }) {
    // eslint-disable-line
    // this.store.dispatch(taskProcessed(uuid));
    this.store.dispatch(uploadItemSuccess(uuid, result));
    // this.processFiles(uuid);
    // toast('1 File has been uploaded successfully.', 'success');
    m.success('1 File has been uploaded successfully.');
  }
}

export default SocketWorkerHandler;
