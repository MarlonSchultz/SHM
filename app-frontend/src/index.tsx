import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ApiContext, ApiContextShape } from 'components/ApiContext';

const apiContext: ApiContextShape = {
    api: String(process.env.REACT_APP_API_ENDPOINT),
};

ReactDOM.render(
    <BrowserRouter>
        <ApiContext.Provider value={apiContext}>
            <App />
        </ApiContext.Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
