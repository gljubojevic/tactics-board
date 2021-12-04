import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ColorComponent from './ColorComponent';
import Paper from '@mui/material/Paper';

class ColorEditor extends Component {
	constructor(props, context) {
		super(props, context);
		this.changed = this.changed.bind(this);
		this.redChanged = this.redChanged.bind(this);
		this.blueChanged = this.blueChanged.bind(this);
		this.greenChanged = this.greenChanged.bind(this);
	}

	changed(val, shift) {
		const color = parseInt(this.props.color.replace("#","0x"));
		const newColor = ((color & ~(0xff<<shift)) | (val << shift));
		const strNewColor = newColor.toString(16);
		const c = "#000000".substr(0, 7 - strNewColor.length) + strNewColor;
		if (null !== this.props.onChange) {
			this.props.onChange(c);
		}
	}

	redChanged(value) {
		this.changed(value, 16);
	}

	greenChanged(value) {
		this.changed(value, 8);
	}

	blueChanged(value) {
		this.changed(value, 0);
	}

	getComponents() {
		const color = parseInt(this.props.color.replace("#","0x"));
		return {
			red: (color >> 16) & 0xff,
			green: (color >> 8) & 0xff,
			blue: color & 0xff
		}
	}

	render() {
		const c = this.getComponents()
		return (
			<Box sx={{width:300}}>
				<Paper sx={{
					height: 90,
					backgroundColor: this.props.color
				}} />
				<ColorComponent label="red" value={c.red} onChange={this.redChanged} />
				<ColorComponent label="green" value={c.green} onChange={this.greenChanged} />
				<ColorComponent label="blue" value={c.blue} onChange={this.blueChanged} />
			</Box>
		);
	}
}

ColorEditor.defaultProps = {
	color: null,
	onChange: null
}

ColorEditor.propTypes = {
	color: PropTypes.string,
	onChange: PropTypes.func
};

export default ColorEditor;