import React from 'react';
import { Component } from 'react';


class SmallLeftGoalIcon extends Component{

render(){
  return (
    <g id="small-goal-icon-left">
      <rect width="80" height="280" fill="url(#goal-net)" stroke="#777777" strokeWidth="4" />
      <line x1="80" x2="80" y1="0" y2="280" strokeWidth="5" stroke="white"  />
      <line x1="80" x2="80" y1="0" y2="280" stroke="red" strokeDasharray="20" strokeWidth="6" />
    </g>
);
}
  
}

export default SmallLeftGoalIcon;