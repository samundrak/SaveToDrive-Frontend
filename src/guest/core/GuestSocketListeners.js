import autobind from 'auto-bind';
import { UPLOAD_SUCCESS, UPLOAD_FAILED, UPLOAD_LOGS, UPLOAD_PROGRESS } from '../../consts';
import { updateItemProgress, uploadItemFailed, uploadItemSuccess } from '../actions/Actions';

class GuestSocketListeners {
  constructor(socket, store) {
    this.socket = socket;
    this.store = store;
    this.mappedEventsHandlers = {};
    autobind(this);
  }

  mapEventsToHandlers() {
    this.mappedEventsHandlers = {
      [UPLOAD_PROGRESS]: this.onUploadProgress,
      [UPLOAD_LOGS]: this.onUploadLogs,
      [UPLOAD_FAILED]: this.onUploadFailed,
      [UPLOAD_SUCCESS]: this.onUploadSuccess,
    };
    return this;
  }

  listen() {
    Object.keys(this.mappedEventsHandlers).forEach((key) => {
      this.socket.on(key, (data) => {
        this.mappedEventsHandlers[key](data);
      });
    });
    return this;
  }

  onUploadProgress({ uuid, progress }) {
    this.store.dispatch(updateItemProgress(uuid, progress));
  }

  onUploadLogs({ type, message, uuid }) {
    if (uuid && type === 'error') {
      this.store.dispatch(uploadItemFailed(uuid, message));
    }
    alertify[(type || 'info').replace(/info/, 'message')](message);
  }

  onUploadFailed({ uuid, message }) {
    this.store.dispatch(uploadItemFailed(uuid, message));
    alertify.error(message);
  }

  onUploadSuccess({ uuid, result }) {
    this.store.dispatch(uploadItemSuccess(uuid, result));
    alertify.success('1 File has been uploaded succesfully.');
  }
}

export default GuestSocketListeners;
