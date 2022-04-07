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
		const fill = -1 !== this.props.color ? null : "red";
		const className = -1 !== this.props.color ? 'ex' + this.props.color : null;
		return (
			<g className={className}>
				<polygon points={points} fill={fill} strokeWidth={this.props.strokeWidth} stroke="black" data-ref={this.props.id} />
			</g>
		);
	}
}

Cone.defaultProps = {
	id: null,
	color: -1,
	x: 0,
	y: 0,
	width: 70,
	height: 85,
	strokeWidth: 6
}

Cone.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	strokeWidth: PropTypes.number
}

export default Cone;