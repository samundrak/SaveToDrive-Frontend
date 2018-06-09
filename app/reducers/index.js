import { combineReducers } from 'redux';
import app from '../reducers/app';
import upload from '../reducers/upload';
import task from '../reducers/task';

const rootReducer = combineReducers({
  app,
  task,
  upload,
});

export default rootReducer;
