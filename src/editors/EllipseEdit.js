import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EllipseEdit extends Component {
	render() {
		const className = (this.props.dashed ? 'ellipse dashed pc' : 'ellipse pc') + this.props.color;
		return (
			<g className={className}>
				<ellipse cx={this.props.cx} cy={this.props.cy} rx={this.props.rx} ry={this.props.ry} data-ref={this.props.id} />
			</g>
		);
	}
}

EllipseEdit.defaultProps = {
	id:"",
	color:0,
	cx:0,
	cy:0,
	rx:0,
	ry:0,
	dashed:false
}

EllipseEdit.propTypes = {
	id: PropTypes.string,
	color: PropTypes.number,
	cx: PropTypes.number,
	cy: PropTypes.number,
	rx: PropTypes.number,
	ry: PropTypes.number,
	dashed: PropTypes.bool
}

export default EllipseEdit;