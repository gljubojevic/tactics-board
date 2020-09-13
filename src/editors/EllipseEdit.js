import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox'
import Ellipse from '../pitch/Ellipse';

class EllipseEdit extends Component {

	editBox() {
		if (!this.props.ellipse.isEdit) {
			return null;
		}
		const box = this.props.ellipse.box;
		return (
			<EditBox x={box.x} y={box.y} width={box.width} height={box.height} id={this.props.ellipse.id} showBox={true} />
		)
	}

	render() {
		const el = this.props.ellipse;
		const className = (el.dashed ? 'ellipse dashed pc' : 'ellipse pc') + el.color;
		return (
			<g className={className}>
				<ellipse cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} data-ref={el.id} />
				{this.editBox()}
			</g>
		)
	}
}

EllipseEdit.defaultProps = {
	ellipse: null
}

EllipseEdit.propTypes = {
	ellipse: PropTypes.instanceOf(Ellipse)
}

export default EllipseEdit;