import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from '../pitch/Player';

class PlayerEdit extends Component {

	renderPlayerName(name) {
		if (0 === name.length) {
			return null;
		}
		return (
			<text y="-70">{name}</text>
		);
	}

	render() {
		const pl = this.props.player;
		const editID = this.props.isEdit ? pl.id : null;
		const editClassName = this.props.isEdit ? 'draggable' : null;
		const className = 'player pc' + pl.color + (this.props.isPrevFrame ? ' transparent': '');
		const transform = 'translate(' + pl.pos.x + ' ' + pl.pos.y + ') rotate(' + pl.rotation + ')';
		return (
			<g className={className} textAnchor="middle" transform={transform}>
				<circle r="50" className={editClassName} data-ref={editID} />
				<text className="number" dominantBaseline="central">{pl.no}</text>
				{this.renderPlayerName(pl.name)}
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