import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './app/layout/styles.css'
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import ScrollToTop from './app/layout/ScrollToTop';
import App from './app/layout/App';
import AdminApp from './app/layout/AdminApp';
import { PaypalCaptureOrder } from './features/paypal/Deposit/PaypalCaptureOrder';

export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop />
    <Switch>
      <Route path='/paypal/accept' component={PaypalCaptureOrder} />
      <Route path='/admin' component={AdminApp} />
      <Route component={App} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
