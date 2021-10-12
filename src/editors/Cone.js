import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Cone extends Component {

	// original shape points "55,10 45,10 30,75 15,80 50,95 85,80 70,75"
	// new is centered on cord 0,0
	static shape = [
		[5,-42],
		[-5,-42],
		[-20,23],
		[-35,28],
		[0,43],
		[35,28],
		[20,23]
	];

	render() {
		let points = "";
		Cone.shape.forEach(p => {
			const x = p[0] + this.props.x;
			const y = p[1] + this.props.y;
			points += `${x},${y} `;
		});
		return (
			<g>
				<polygon points={points} stroke="black"/>
			</g>
		);
	}
}

Cone.defaultProps = {
	id: null,
	x: 0,
	y: 0,
	width: 70,
	height: 85
}

Cone.propTypes = {
	id: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number
}

export default Cone;