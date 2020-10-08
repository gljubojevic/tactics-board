import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Line from '../pitch/Line';
import DragHandle from './DragHandle';

class LineEdit extends Component {

	editHandles(l) {
		if (!l.isEdit) {
			return null;
		}
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
		const d = "M " + p.p1.x + " " + p.p1.y + " C " + p.c1.x + " " + p.c1.y + " " + p.c2.x + " " + p.c2.y + " " + p.p2.x + " " + p.p2.y;
		const markerStart = p.arrowStart ? "url(#arrowStart)" : "";
		const markerEnd = p.arrowEnd ? "url(#arrowEnd)" : "";
		return (
			<path key={key} d={d} data-ref={p.id} markerStart={markerStart} markerEnd={markerEnd} />
		);
	}

	render() {
		const l = this.props.line;
		const className = (l.dashed ? 'line dashed pc' : 'line pc') + l.color;
		const allPaths = l.paths().map((p, index) => this.renderPath(p, index.toString()));
		return (
			<g className={className}>
				{allPaths}
				{this.editHandles(l)}
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