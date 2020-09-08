import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox'

class SquareEdit extends Component {

	editBox() {
		if (!this.props.isEdit) {
			return null;
		}
		return (
			<EditBox x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} id={this.props.id} showBox={false} />
		)
	}

	render() {
		const className = (this.props.dashed ? 'square dashed pc' : 'square pc') + this.props.color;
		return (
			<g className={className}>
				<rect x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} data-ref={this.props.id} />
				{this.editBox()}
			</g>
		);
	}
}

SquareEdit.defaultProps = {
	id:"",
	color:0,
	x:0,
	y:0,
	width:0,
	height:0,
	dashed:false,
	isEdit:false
}

SquareEdit.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	dashed: PropTypes.bool,
	isEdit: PropTypes.bool,
}

export default SquareEdit;