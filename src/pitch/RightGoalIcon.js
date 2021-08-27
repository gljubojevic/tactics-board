import React from 'react';
import { Component } from 'react';


class LeftGoalIcon extends Component{

render(){
  return (
    <g id="goal-icon-left">
      <rect width="100" height="300" fill="url(#goal-net)" stroke="#777777" strokeWidth="4" />
      <line x1="0" x2="0" y1="0" y2="300" strokeWidth="5" stroke="white"  />
      <line x1="0" x2="0" y1="0" y2="300" stroke="red" strokeDasharray="20" strokeWidth="6" />
    </g>
);
}
  
}

export default LeftGoalIcon;