import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlayerEdit extends Component {
	constructor(props) {
		super(props);
		console.log("Creating player:", props.index);
	}

	render() {
		const transform = 'translate(' + this.props.x + ' ' + this.props.y + ')';
		return (
			<g textAnchor="middle" transform={transform}>
				<circle r="50" cx="50" cy="70" />
				<text fill="white" x="50" y="70" dominantBaseline="central">{this.props.index}</text>
				<text x="50">{this.props.name}</text>
			</g>
		);
	}
}

PlayerEdit.defaultProps = {
	index: 0,
	x:0,
	y:0,
	name: ""
}

PlayerEdit.propTypes = {
	index: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
	name: PropTypes.string
}

export default PlayerEdit;