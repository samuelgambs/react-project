import React, { Component } from 'react';
import stocks from './stocks.json';
import AutoComplete from './autocomplete';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
    };
  }

  render() {
    const suggestions = []
    stocks.market.company.map((j) => (j.stock.map((g) => (suggestions.push(g.name)))))
    return (
      <div className="App">
        <header>
          <div className="bgBack">
            <div className="logo">stocks.</div>
            <AutoComplete
              suggestions={suggestions}
            />
          </div>
          </header>
      </div>
    );
  }
}

export default App;
