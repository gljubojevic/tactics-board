import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox';
import Goal from './Goal';
import Ladder from './Ladder';
import Cone from './Cone';
import Flag from './Flag';
import Extras from '../pitch/Extras';
import { ExtrasType } from '../pitch/Constants';

class ExtrasEdit extends Component {

	editBox(isEdit, box, isBoxVisible, isResizable, isRotatable) {
		if (!isEdit) {
			return null;
		}
		return (
			<EditBox box={box} showBox={isBoxVisible} showResize={isResizable} showRotate={isRotatable} />
		)
	}

	renderGfx(ex) {
		switch (ex.t) {
			case ExtrasType.Goal:
			case ExtrasType.GoalSmall:
				return (<Goal id={ex.id} x={ex.x} y={ex.y} width={ex.width} height={ex.height} />);
			case ExtrasType.Ladder:
				return (<Ladder id={ex.id} color={ex.color} x={ex.x} y={ex.y} width={ex.width} height={ex.height} strokeWidth={12} />);
			case ExtrasType.Cone:
				return (<Cone id={ex.id} color={ex.color} x={ex.x} y={ex.y} width={ex.width} height={ex.height} />);
			case ExtrasType.Flag:
				return (<Flag id={ex.id} color={ex.color} x={ex.x} y={ex.y} width={ex.width} height={ex.height} strokeWidth={12} />);
			default:
				return (<rect x={ex.x} y={ex.y} width={ex.width} height={ex.height} data-ref={ex.id} />);
		}
	}

	render() {
		const ex = this.props.extras;
		const transform = 'rotate('+ ex.rotation + ',' + ex.x + ',' + ex.y + ')';
		return (
			<g transform={transform}>
				{this.renderGfx(ex)}
				{this.editBox(ex.isEdit, ex.box, ex.isBoxVisible, ex.isResizable, ex.isRotatable)}
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