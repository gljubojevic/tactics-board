import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditBox extends Component {

	constructor(props) {
		super(props);
		this._handleSize = 50; // default handle size
	}

	mainBox() {
		if (!this.props.showBox) {
			return null;
		}
		return (
			<rect className="editBox" x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} />
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
		const etl = this.cornerBox(this.props.x, this.props.y);
		const etr = this.cornerBox(this.props.x + this.props.width, this.props.y);
		const ebl = this.cornerBox(this.props.x, this.props.y + this.props.height);
		const ebr = this.cornerBox(this.props.x + this.props.width, this.props.y + this.props.height);

		return (
			<g>
				{this.mainBox()}
				<rect className="editCorner draggable" x={etl.x} y={etl.y} width={etl.size} height={etl.size} data-ref={"edit-tl-" + this.props.id} />
				<rect className="editCorner draggable" x={etr.x} y={etr.y} width={etr.size} height={etr.size} data-ref={"edit-tr-" + this.props.id} />
				<rect className="editCorner draggable" x={ebl.x} y={ebl.y} width={ebl.size} height={ebl.size} data-ref={"edit-bl-" + this.props.id} />
				<rect className="editCorner draggable" x={ebr.x} y={ebr.y} width={ebr.size} height={ebr.size} data-ref={"edit-br-" + this.props.id} />
			</g>
		)
	}
}

EditBox.defaultProps = {
	id:"",
	x:0,
	y:0,
	width:0,
	height:0,
	showBox:false
}

EditBox.propTypes = {
	id: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	showBox: PropTypes.bool
}

export default EditBox;