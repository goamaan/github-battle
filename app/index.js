import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import Popular from './components/Popular';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Popular />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
