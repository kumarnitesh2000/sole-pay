import React from 'react';
import UpiInfo from './Components/UpiInfo'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import CardInfo from './Components/CardInfo';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
})

function App() {
  return (
    <div className="app">
      <Router basename={'/app'}>
        <Switch>
        <Route path={`/test`}><h1>hello from test your route runs enjoy</h1></Route>
        <Route path={`/get`}>
            <CardInfo />
        </Route>
        <Route path={`/`}>
            <UpiInfo />
          </Route>
        </Switch>
      </Router>
    
    </div>
  );
}

export default App;
