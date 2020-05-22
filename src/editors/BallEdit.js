import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BallEdit extends Component {
	render() {
		const className = 'ball bc' + this.props.color;
		const transform = 'translate(' + this.props.x + ' ' + this.props.y + ')';
		return (
			<g className={className} transform={transform}>
				<circle r="30" cx="30" cy="30" className="draggable" data-ref={this.props.id} />
			</g>
		);
	}
}

BallEdit.defaultProps = {
	id:"",
	x:0,
	y:0,
	color:0
}

BallEdit.propTypes = {
	id: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	color: PropTypes.number
}

export default BallEdit;