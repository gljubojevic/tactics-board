import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Flag extends Component {

	render() {
		const w = this.props.width;
		const h = this.props.height;
		const hW = w / 2;	// half width
		const hH = h / 2;	// half height
		const lX = this.props.x - hW;	// left X
		const tY = this.props.y - hH;	// top Y
		const bY = this.props.y + hH;	// bottom Y
		const sW = this.props.strokeWidth;
		const fill = -1 !== this.props.color ? null : "red";
		const className = -1 !== this.props.color ? 'ex' + this.props.color : null;
		return (
			<g className={className}>
				<rect x={lX} y={tY} width={w} height={h/3} fill={fill} stroke="black" strokeWidth={sW / 2} data-ref={this.props.id} />
				<line x1={lX} y1={tY} x2={lX} y2={bY} stroke="black" strokeWidth={sW} data-ref={this.props.id} />
			</g>
		);
	}
}

Flag.defaultProps = {
	id: null,
	color: -1,
	x: 0,
	y: 0,
	width: 130,
	height: 280,
	strokeWidth: 6
}

Flag.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	strokeWidth: PropTypes.number
}

export default Flag;