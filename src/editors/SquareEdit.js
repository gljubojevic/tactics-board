import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SquareEdit extends Component {
	render() {
		const className = 'square pc' + this.props.color;
		return (
			<g className={className}>
				<rect x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} data-ref={this.props.id} />
			</g>
		);
	}
}

SquareEdit.defaultProps = {
	id:"",
	color:0,
	x:0,
	y:0,
	width:0,
	height:0
}

SquareEdit.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
}

export default SquareEdit;