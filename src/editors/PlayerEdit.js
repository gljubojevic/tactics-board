import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlayerEdit extends Component {

	render() {
		const className = 'player pc' + this.props.color;
		const transform = 'translate(' + this.props.x + ' ' + this.props.y + ')';
		return (
			<g className={className} textAnchor="middle" transform={transform}>
				<circle r="50" cx="50" cy="70" className="draggable" data-ref={this.props.id} />
				<text className="number" x="50" y="70" dominantBaseline="central">{this.props.no}</text>
				<text x="50">{this.props.name}</text>
			</g>
		);
	}
}

PlayerEdit.defaultProps = {
	id:"",
	x:0,
	y:0,
	color:0,
	no: "",
	name: ""
}

PlayerEdit.propTypes = {
	id: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	color: PropTypes.number,
	no: PropTypes.string,
	name: PropTypes.string
}

export default PlayerEdit;