import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Ladder extends Component {

	steps(xL, xR, yT, h, noSteps, sW, sC) {
		const yStep = h / (noSteps + 1);
		return [...Array(noSteps)].map((e, idx) => {
			const y = yT + (idx + 1) * yStep;
			return (
				<line key={idx} x1={xL} y1={y} x2={xR} y2={y} strokeWidth={sW} stroke={sC} data-ref={this.props.id} />
			);
		});
	}

	render() {
		const w = this.props.width;
		const h = this.props.height;
		const hW = w / 2;	// half width
		const hH = h / 2;	// half height
		const xL = this.props.x-hW;	// left side
		const xR = this.props.x+hW;	// right side
		const yT = this.props.y-hH;	// top side
		const yB = this.props.y+hH;	// bottom side
		const sW = this.props.strokeWidth;
		const sC = -1 !== this.props.color ? null : "black";
		const className = -1 !== this.props.color ? 'ex' + this.props.color : null;
		return (
			<g className={className}>
				<line x1={xL} y1={yT} x2={xL} y2={yB} strokeWidth={sW} stroke={sC} data-ref={this.props.id} />
				{this.steps(xL, xR, yT, h, 5, sW, sC)}
				<line x1={xR} y1={yT} x2={xR} y2={yB} strokeWidth={sW} stroke={sC} data-ref={this.props.id} />
			</g>
		);
	}

}

Ladder.defaultProps = {
	id: null,
	color: -1,
	x: 0,
	y: 0,
	width: 150,
	height: 350,
	strokeWidth: 6
}

Ladder.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	strokeWidth: PropTypes.number
}

export default Ladder;