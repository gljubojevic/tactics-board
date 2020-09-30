import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '../pitch/Box';
import Point from '../pitch/Point';
import DragHandle from './DragHandle';
import RotateHandle from './RotateHandle';

class EditBox extends Component {

	render() {
		const box = this.props.box;
		const tl = new Point(box.x, box.y);
		const tr = new Point(box.x + box.width, box.y);
		const bl = new Point(box.x, box.y + box.height);
		const br = new Point(box.x + box.width, box.y + box.height);
		const boxClass = this.props.showBox ? "editBox draggable" : "editTransparent draggable";

		return (
			<g>
				<rect className={boxClass} x={box.x} y={box.y} width={box.width} height={box.height} data-ref={"edit-mv-" + box.id} />
				<DragHandle id={"edit-tl-" + box.id} position={tl} />
				<DragHandle id={"edit-tr-" + box.id} position={tr} />
				<DragHandle id={"edit-bl-" + box.id} position={bl} />
				<DragHandle id={"edit-br-" + box.id} position={br} />
				<RotateHandle box={box} />
			</g>
		)
	}
}

EditBox.defaultProps = {
	box: null,
	showBox:false
}

EditBox.propTypes = {
	box: PropTypes.instanceOf(Box),
	showBox: PropTypes.bool
}

export default EditBox;