/* eslint-disable no-console */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from '../Home/Home';
import About from '../About/About';
import Contact from '../Contact/Contact';
import Tech from '../Tech/Tech';
import Projects from '../Projects/Projects';
import Landscape from '../Landscape/Landscape';
import './App.css';

export default function App() {
  console.warn = () => {};

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/tech" exact component={Tech} />
        <Route path="/projects" exact component={Projects} />  
        <Route path="/landscape/:redirect" component={Landscape} />      
      </Switch>
    </Router>
  );
}
