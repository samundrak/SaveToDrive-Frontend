import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppFooter from '../components/common/Footer';
import NavBar from '../guest/containers/NavBar';
import Index from '../guest/pages/Index';
import PAGE404 from '../components/404';
import Login from '../guest/pages/Login';
import RegisterPage from '../guest/pages/Register';
import CreatePassword from '../guest/pages/CreatePassword';
import ForgotPassword from '../guest/pages/ForgotPassword';
import ResetPassword from '../guest/pages/ResetPassword';

const App = () => (
  <div>
    <NavBar />
    <Switch>
      <Route exact path="/" component={Index} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/new-password" component={ResetPassword} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/create-password/:service" component={CreatePassword} />
      <Route component={PAGE404} />
    </Switch>
    <AppFooter />
  </div>
);

App.propTypes = {};

export default App;
