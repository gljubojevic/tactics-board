import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox'
import Ellipse from '../pitch/Ellipse';

class EllipseEdit extends Component {

	editBox(isEdit, box) {
		if (!isEdit) {
			return null;
		}
		return (
			<EditBox box={box} showBox={true} />
		)
	}

	render() {
		const el = this.props.ellipse;
		const className = (el.dashed ? 'ellipse dashed pc' : 'ellipse pc') + el.color;
		const transform = 'rotate('+ el.rotation + ',' + el.cx + ',' + el.cy + ')';
		return (
			<g className={className} transform={transform}>
				<ellipse cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} data-ref={el.id} />
				{this.editBox(el.isEdit, el.box)}
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