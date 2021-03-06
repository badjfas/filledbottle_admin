import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko';
import { registerLocale } from  "react-datepicker";
import reducer from './store/reducer'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import store from './store'

//const store = createStore(reducer);

registerLocale('ko', ko)

ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
