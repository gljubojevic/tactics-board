import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '../pitch/Box';
import Point from '../pitch/Point';
import DragHandle from './DragHandle';
import RotateHandle from './RotateHandle';

class EditBox extends Component {

	renderHandles(box) {
		if (!this.props.showResize) {
			return;
		}
		const tl = new Point(box.x, box.y);
		const tr = new Point(box.x + box.width, box.y);
		const bl = new Point(box.x, box.y + box.height);
		const br = new Point(box.x + box.width, box.y + box.height);
		return (
			<React.Fragment>
				<DragHandle id={"edit-tl-" + box.id} position={tl} />
				<DragHandle id={"edit-tr-" + box.id} position={tr} />
				<DragHandle id={"edit-bl-" + box.id} position={bl} />
				<DragHandle id={"edit-br-" + box.id} position={br} />
			</React.Fragment>
		)
	}

	render() {
		const box = this.props.box;
		const boxClass = this.props.showBox ? "editBox draggable" : "editTransparent draggable";

		return (
			<g>
				<rect className={boxClass} x={box.x} y={box.y} width={box.width} height={box.height} data-ref={"edit-mv-" + box.id} />
				 {this.renderHandles(box)}
				<RotateHandle box={box} />
			</g>
		)
	}
}

EditBox.defaultProps = {
	box: null,
	showBox:false,
	showResize:true
}

EditBox.propTypes = {
	box: PropTypes.instanceOf(Box),
	showBox: PropTypes.bool,
	showResize: PropTypes.bool
}

export default EditBox;