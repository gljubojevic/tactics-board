import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Point from '../pitch/Point';

class DragHandle extends Component {
	render() {
		const half = this.props.size / 2;
		const x = this.props.position.x - half;
		const y = this.props.position.y - half;
		return (
			<rect className="editCorner draggable" x={x} y={y} width={this.props.size} height={this.props.size} data-ref={this.props.id} />
		);
	}
}

DragHandle.defaultProps = {
	id: "",
	size: 50,
	position: null
}

DragHandle.propTypes = {
	id: PropTypes.string,
	size: PropTypes.number,
	position: PropTypes.instanceOf(Point)
}

export default DragHandle;