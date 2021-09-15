import React from 'react';
import { Component } from 'react';


class Ladder extends Component {

  render() {
    return (
      <g id="ladder-icon">
        <line x1="100" x2="100" y1="0" y2="300" strokeWidth="5" stroke="black"/>
        <line x1="170" x2="170" y1="0" y2="300" strokeWidth="5" stroke="black"/>

        <line x1="100" x2="170" y1="270" y2="270" strokeWidth="5" stroke="black"/>
        <line x1="100" x2="170" y1="210" y2="210" strokeWidth="5" stroke="black"/>
        <line x1="100" x2="170" y1="150" y2="150" strokeWidth="5" stroke="black"/>
        <line x1="100" x2="170" y1="90" y2="90" strokeWidth="5" stroke="black"/>
        <line x1="100" x2="170" y1="30" y2="30" strokeWidth="5" stroke="black"/>
      </g>
    );
  }
}

export default Ladder;