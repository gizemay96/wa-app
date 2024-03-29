import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import { UserProvider } from "./contexts/UserContext";

ReactDOM.render(
  <UserProvider>
  <BrowserRouter basename="">
    <App />
  </BrowserRouter>
  </UserProvider>
, document.getElementById('root'));

serviceWorker.unregister();