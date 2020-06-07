import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import Index from './components/index';
import homePageMatter from "./components/homePageMatter";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';


ReactDOM.render(

            <Router>
                <div>
                    <Route path="/" component={Index} />
                    {/*<Route path="/register" component={NavBar} />*/}
                    {/*<Route path="/login" component={NavBar} />*/}
                </div>
            </Router>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
