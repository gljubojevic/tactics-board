import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '../pitch/Box';

class EditBox extends Component {

	constructor(props) {
		super(props);
		this._handleSize = 50; // default handle size
	}

	mainBox() {
		if (!this.props.showBox) {
			return null;
		}
		const box = this.props.box;
		return (
			<rect className="editBox" x={box.x} y={box.y} width={box.width} height={box.height} />
		)
	}

	cornerBox(x, y) {
		const half = this._handleSize / 2;
		return { 
			x: x - half, 
			y: y - half,
			size: this._handleSize
		}
	}

	render() {
		const box = this.props.box;
		const etl = this.cornerBox(box.x, box.y);
		const etr = this.cornerBox(box.x + box.width, box.y);
		const ebl = this.cornerBox(box.x, box.y + box.height);
		const ebr = this.cornerBox(box.x + box.width, box.y + box.height);

		return (
			<g>
				{this.mainBox()}
				<rect className="editCorner draggable" x={etl.x} y={etl.y} width={etl.size} height={etl.size} data-ref={"edit-tl-" + box.id} />
				<rect className="editCorner draggable" x={etr.x} y={etr.y} width={etr.size} height={etr.size} data-ref={"edit-tr-" + box.id} />
				<rect className="editCorner draggable" x={ebl.x} y={ebl.y} width={ebl.size} height={ebl.size} data-ref={"edit-bl-" + box.id} />
				<rect className="editCorner draggable" x={ebr.x} y={ebr.y} width={ebr.size} height={ebr.size} data-ref={"edit-br-" + box.id} />
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