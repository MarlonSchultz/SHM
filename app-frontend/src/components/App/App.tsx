import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ProjectInput from 'components/Projects/ProjectInput/ProjectInput'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Stegholder Mähp</h1>
        </header>
        <div>
          <ProjectInput/>
        </div>
      </div>
    );
  }
}

export default App;
