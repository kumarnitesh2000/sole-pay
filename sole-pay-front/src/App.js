import React from 'react';
import UpiInfo from './Components/UpiInfo'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import CardInfo from './Components/CardInfo'
function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
        <Route path="/test"><h1>hello from test your route runs enjoy</h1></Route>
        <Route path="/get">
            <CardInfo />
        </Route>
        <Route path="/">
            <UpiInfo />
          </Route>
        </Switch>
      </Router>
    
    </div>
  );
}

export default App;
