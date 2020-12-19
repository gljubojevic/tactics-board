import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Player from '../pitch/Player';

class PlayerEdit extends Component {

	render() {
		const pl = this.props.player;
		const className = 'player pc' + pl.color;
		const transform = 'translate(' + pl.x + ' ' + pl.y + ')';
		return (
			<g className={className} textAnchor="middle" transform={transform}>
				<circle r="50" cx="50" cy="70" className="draggable" data-ref={pl.id} />
				<text className="number" x="50" y="70" dominantBaseline="central">{pl.no}</text>
				<text x="50">{pl.name}</text>
			</g>
		);
	}
}

PlayerEdit.defaultProps = {
	player: null
}

PlayerEdit.propTypes = {
	player: PropTypes.instanceOf(Player)
}

export default PlayerEdit;