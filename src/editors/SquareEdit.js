import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditBox from './EditBox'
import Square from '../pitch/Square';

class SquareEdit extends Component {

	editBox(isEdit, box) {
		if (!isEdit) {
			return null;
		}
		return (
			<EditBox box={box} showBox={false} />
		)
	}

	render() {
		const sq = this.props.square;
		const className = (sq.dashed ? 'square dashed pc' : 'square pc') + sq.color;
		return (
			<g className={className}>
				<rect x={sq.x} y={sq.y} width={sq.width} height={sq.height} data-ref={sq.id} />
				{this.editBox(sq.isEdit, sq.box)}
			</g>
		);
	}
}

SquareEdit.defaultProps = {
	square: null
}

SquareEdit.propTypes = {
	square: PropTypes.instanceOf(Square)
}

export default SquareEdit;