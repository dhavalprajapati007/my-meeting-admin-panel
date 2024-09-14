import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from './redux/store';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

// To solve routing issues in S3 (static webhost)
const replaceHashPath = () => {
  const history = createBrowserHistory()
  const hash = history.location.hash
  if (hash) {
    const path = hash.replace(/^#/, '')
    if (path) {
      history.replace(path)
    }
  }
}
replaceHashPath();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);