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
		return (
			<g>
				<rect x={lX} y={tY} width={w} height={h/3} fill="red" stroke="black" strokeWidth="3" data-ref={this.props.id} />
				<line x1={lX} y1={tY} x2={lX} y2={bY} stroke="black" strokeWidth="6" data-ref={this.props.id} />
			</g>
		);
	}
}

Flag.defaultProps = {
	id: null,
	x: 0,
	y: 0,
	width: 130,
	height: 280
}

Flag.propTypes = {
	id: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number
}

export default Flag;