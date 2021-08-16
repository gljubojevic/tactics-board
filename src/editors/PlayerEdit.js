import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from '../pitch/Player';

class PlayerEdit extends Component {

	render() {
		const pl = this.props.player;
		const editID = this.props.isEdit ? pl.id : null;
		const editClassName = this.props.isEdit ? 'draggable' : null;
		const className = 'player pc' + pl.color;
		const transform = 'translate(' + pl.x + ' ' + pl.y + ')';
		return (
			<g className={className} textAnchor="middle" transform={transform}>
				<circle r="50" cx="50" cy="70" className={editClassName} data-ref={editID} />
				<text className="number" x="50" y="70" dominantBaseline="central">{pl.no}</text>
				<text x="50">{pl.name}</text>
			</g>
		);
	}
}

PlayerEdit.defaultProps = {
	player: null,
	isEdit: true
}

PlayerEdit.propTypes = {
	player: PropTypes.instanceOf(Player),
	isEdit: PropTypes.bool
}

export default PlayerEdit;