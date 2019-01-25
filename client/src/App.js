import React, { Component } from "react";
import { Route, BrowserRouter as Router, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <div className="link-block">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span>
              <Link to="/otherpage">Other page!</Link>
            </span>
          </div>
          <div>
            <Route exact path="/" component={Fib} />
            <Route path="/otherpage" component={OtherPage} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
