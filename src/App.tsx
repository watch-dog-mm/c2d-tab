import * as React from 'react';
import { HashRouter as Router,Routes, Route } from 'react-router-dom'
import SettingView from './container/setting'
import logo from './logo.svg';
import './App.css';

const App=()=> {
 
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <Router basename="/">
              <Routes>
              <Route  path={`/`} element={ <SettingView />}/>
           
              <Route  path={`/setting`} element={<SettingView />}/>
              </Routes>
          </Router>
      {/* </header> */}
    </div>
  )
}

export default App;
