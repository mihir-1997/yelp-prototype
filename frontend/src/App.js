import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

import Routes from "./components/Routes"
import { Provider } from 'react-redux';

import store from './store';

function App () {
  return (
    <div>
      <Provider store={ store }>
        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
