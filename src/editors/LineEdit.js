import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Line from '../pitch/Line';
import DragHandle from './DragHandle';

class LineEdit extends Component {

	editHandles(l, isPath) {
		if (!l.isEdit) {
			return null;
		}
		// path editing only shows control points
		if (isPath) {
			return (
				<React.Fragment>
					<DragHandle id={"edit-l2-" + l.id} position={l.c1} />
					<DragHandle id={"edit-l3-" + l.id} position={l.c2} />
				</React.Fragment>
			);
		}
		// line editing shows all control points
		return (
			<React.Fragment>
				<DragHandle id={"edit-l1-" + l.id} position={l.p1} />
				<DragHandle id={"edit-l2-" + l.id} position={l.c1} />
				<DragHandle id={"edit-l3-" + l.id} position={l.c2} />
				<DragHandle id={"edit-l4-" + l.id} position={l.p2} />
			</React.Fragment>
		);
	}

	renderPath(p, key) {
		const d = `M ${p.p1.x} ${p.p1.y} C ${p.c1.x} ${p.c1.y} ${p.c2.x} ${p.c2.y} ${p.p2.x} ${p.p2.y}`;
		const markerStart = p.arrowStart ? "url(#arrowStart)" : null;
		const markerEnd = p.arrowEnd ? "url(#arrowEnd)" : null;
		return (
			<path key={key} d={d} data-ref={p.id} markerStart={markerStart} markerEnd={markerEnd} />
		);
	}

	render() {
		const l = this.props.line;
		let className = this.props.isPath ? 'path' : 'line';
		className += (l.dashed ? ' dashed' : '');
		if (this.props.isPath) {
			className += (this.props.forPlayer ? ' ppc' : ' bpc') + l.color;
		} else {
			className += ' ec' + l.color;
		}
		const allPaths = l.paths().map((p, index) => this.renderPath(p, index.toString()));
		return (
			<g className={className}>
				{allPaths}
				{this.editHandles(l, this.props.isPath)}
			</g>
		);
	}
}

LineEdit.defaultProps = {
	line: null,
	isPath: false,
	forPlayer: false	// when path it is either player or ball
}

LineEdit.propTypes = {
	line: PropTypes.instanceOf(Line),
	isPath: PropTypes.bool,
	forPlayer: PropTypes.bool 	// when path it is either player or ball
}

export default LineEdit;