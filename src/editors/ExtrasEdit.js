import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox'
import Extras from '../pitch/Extras';

class ExtrasEdit extends Component {

	editBox(isEdit, box, isResizable, isRotatable) {
		if (!isEdit) {
			return null;
		}
		return (
			<EditBox box={box} showBox={false} showResize={isResizable} showRotate={isRotatable} />
		)
	}

	// TODO: Show gfx instead rectangle
	render() {
		const ex = this.props.extras;
		const transform = 'rotate('+ ex.rotation + ',' + ex.x + ',' + ex.y + ')';
		return (
			<g transform={transform}>
				<rect x={sq.x} y={sq.y} width={sq.width} height={sq.height} data-ref={sq.id} />
				{this.editBox(ex.isEdit, ex.box, ex.isResizable, ex.isRotatable)}
			</g>
		);
	}
}

ExtrasEdit.defaultProps = {
	extras: null
}

ExtrasEdit.propTypes = {
	extras: PropTypes.instanceOf(Extras)
}

export default ExtrasEdit;