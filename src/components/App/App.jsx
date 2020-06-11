import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Projects from '../Projects/Projects';
import Home from '../Home/Home';
import './App.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/projects" exact component={Projects} />
      </Switch>
    </Router>
  );
}
