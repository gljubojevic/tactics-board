import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox'

class EllipseEdit extends Component {

	editBox() {
		if (!this.props.isEdit) {
			return null;
		}
		const x = this.props.cx - this.props.rx;
		const y = this.props.cy - this.props.ry;
		const width = this.props.rx * 2;
		const height = this.props.ry * 2;
		return (
			<EditBox x={x} y={y} width={width} height={height} id={this.props.id} showBox={true} />
		)
	}

	render() {
		const className = (this.props.dashed ? 'ellipse dashed pc' : 'ellipse pc') + this.props.color;
		return (
			<g className={className}>
				<ellipse cx={this.props.cx} cy={this.props.cy} rx={this.props.rx} ry={this.props.ry} data-ref={this.props.id} />
				{this.editBox()}
			</g>
		)
	}
}

EllipseEdit.defaultProps = {
	id:"",
	color:0,
	cx:0,
	cy:0,
	rx:0,
	ry:0,
	dashed:false,
	isEdit:false
}

EllipseEdit.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	cx: PropTypes.number,
	cy: PropTypes.number,
	rx: PropTypes.number,
	ry: PropTypes.number,
	dashed: PropTypes.bool,
	isEdit: PropTypes.bool
}

export default EllipseEdit;