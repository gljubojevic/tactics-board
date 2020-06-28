import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LineEdit extends Component {
	render() {
		const className = 'line pc' + this.props.color;
		const markerStart = this.props.arrowStart ? "url(#arrowStart)" : "";
		const markerEnd = this.props.arrowEnd ? "url(#arrowEnd)" : "";
		return (
			<g className={className}>
				<line x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} markerStart={markerStart} markerEnd={markerEnd} data-ref={this.props.id} />
			</g>
		);
	}
}

LineEdit.defaultProps = {
	id: "",
	color: 0,
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0,
	arrowStart: false,
	arrowEnd: false,
	dashed: false
}

LineEdit.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	x1: PropTypes.number,
	y1: PropTypes.number,
	x2: PropTypes.number,
	y2: PropTypes.number,
	arrowStart: PropTypes.bool,
	arrowEnd: PropTypes.bool,
	dashed: PropTypes.bool
}


export default LineEdit;