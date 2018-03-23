import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
        <h1 className="main-title">Bloc Jams</h1>
          <nav className="nav-main">
            <Link to='/' id="landing">Landing</Link>
            <Link to='/library' id="library">Library</Link>
          </nav>
        </header>

        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
        </main>
      </div>
    );
  }
}

export default App;
