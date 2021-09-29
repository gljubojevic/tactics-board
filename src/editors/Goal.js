import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Goal extends Component {

	render() {
		const w = this.props.width;
		const h = this.props.height;
		const hW = w / 2;	// half width
		const hH = h / 2;	// half height
		// top left corner of rect regarding x,y center position
		const tlX = this.props.x - hW;
		const tlY = this.props.y - hH;
		// top right corner of rect regarding x,y center position
		const trX = this.props.x + hW;
		const trY = this.props.y - hH;
		// bottom right corner of rect regarding x,y center position
		const brX = this.props.x + hW;
		const brY = this.props.y + hH;
		return (
			<g>
				<rect x={tlX} y={tlY} width={w} height={h} fill="url(#goal-net)" stroke="#777777" strokeWidth="4" data-ref={this.props.id} />
				<line x1={trX} y1={trY} x2={brX} y2={brY} strokeWidth="5" stroke="white" />
				<line x1={trX} y1={trY} x2={brX} y2={brY} stroke="red" strokeDasharray="20" strokeWidth="6" />
			</g>
		);
	}
}

Goal.defaultProps = {
	id: null,
	x: 0,
	y: 0,
	width: 100,
	height: 300
}

Goal.propTypes = {
	id: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number
}


export default Goal;