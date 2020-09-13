import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Line from '../pitch/Line';

class LineEdit extends Component {
	render() {
		const l = this.props.line;
		const className = (l.dashed ? 'line dashed pc' : 'line pc') + l.color;
		const markerStart = l.arrowStart ? "url(#arrowStart)" : "";
		const markerEnd = l.arrowEnd ? "url(#arrowEnd)" : "";
		return (
			<g className={className}>
				<line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} markerStart={markerStart} markerEnd={markerEnd} data-ref={l.id} />
			</g>
		);
	}
}

LineEdit.defaultProps = {
	line: null
}

LineEdit.propTypes = {
	line: PropTypes.instanceOf(Line)
}

export default LineEdit;