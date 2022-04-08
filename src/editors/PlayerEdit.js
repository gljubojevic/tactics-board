import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from '../pitch/Player';
import Box from '../pitch/Box';
import RotateHandle from './RotateHandle';

class PlayerEdit extends Component {

	renderRotateHandle(isEdit, pl) {
		if (!(isEdit && pl.isEdit)) {
			return null;
		}
		const box = new Box(pl.id, -25, 0, 50, 50);
		return (
			<RotateHandle box={box} />
		)
	}

	renderPlayerName(name) {
		if (0 === name.length) {
			return null;
		}
		return (
			<text y="-70">{name}</text>
		);
	}

	renderHands(pl) {
		if (!pl.isPlaced) {
			return null;
		}
		const rotation = `rotate(${pl.rotation})`;
		return (
			<g transform={rotation}>
				<line x1={-40} y1={-20} x2={0} y2={20} strokeWidth="20" strokeLinecap="round" />
				<line x1={40} y1={-20} x2={0} y2={20} strokeWidth="20" strokeLinecap="round" />
				{this.renderRotateHandle(this.props.isEdit, pl)}
			</g>
		);
	}

	render() {
		const pl = this.props.player;
		const editID = this.props.isEdit ? pl.id : null;
		const editClassName = this.props.isEdit ? 'draggable' : null;
		const className = 'player pc' + pl.color + (this.props.isPrevFrame ? ' transparent': '');
		const transform = `translate(${pl.pos.x} ${pl.pos.y})`;
		return (
			<g className={className} textAnchor="middle" transform={transform}>
				<circle r="42" className={editClassName} stroke="#fff" strokeWidth="4" data-ref={editID} />
				{this.renderPlayerName(pl.name)}
				{this.renderHands(pl)}
				<text className="number" dominantBaseline="central">{pl.no}</text>
			</g>
		);
	}
}

PlayerEdit.defaultProps = {
	player: null,
	isEdit: true, 
	isPrevFrame: false
}

PlayerEdit.propTypes = {
	player: PropTypes.instanceOf(Player),
	isEdit: PropTypes.bool,
	isPrevFrame: PropTypes.bool
}

export default PlayerEdit;