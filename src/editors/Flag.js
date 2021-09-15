import React from 'react';
import { Component } from 'react';


class Flag extends Component {

  render() {
    return (
      <g id="flag-icon">
        <rect width="130" height="90" fill="red" stroke="black" strokeWidth="3" />
        <line x1="0" x2="0" y1="0" y2="280" strokeWidth="6" stroke="black" />
      </g>
    );
  }
}

export default Flag;