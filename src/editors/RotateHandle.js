import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '../pitch/Box';

class RotateHandle extends Component {
	render() {
		const box = this.props.box;
		const half = box.width / 2;
		const x1 = box.x + half;
		const y1 = box.y;
		const x2 = x1;
		const y2 = y1 - 2 * this.props.size;
		return (
			<React.Fragment>
				<line x1={x1} y1={y1} x2={x2} y2={y2} />
				<circle className="editCorner draggable" cx={x2} cy={y2} r={this.props.size/2} data-ref={"edit-rt-" + box.id} />
			</React.Fragment>
		);
	}
}

RotateHandle.defaultProps = {
	size: 50,
	box: null
}

RotateHandle.propTypes = {
	size: PropTypes.number,
	box: PropTypes.instanceOf(Box),
}

export default RotateHandle;