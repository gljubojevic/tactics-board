import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';

class ColorPalette extends Component {
	constructor(props, context) {
		super(props, context);
		this.selected = this.selected.bind(this);
	}

	selected(e) {
		const index = parseInt(e.target.value);
		if (null !== this.props.onSelected) {
			this.props.onSelected(index, this.props.palette[index]);
		}
	}

	radioIcon(isChecked, color) {
		if (!isChecked) {
			return (
				<Box sx={{
					width: this.props.colorWidth,
					height: this.props.colorHeight,
					backgroundColor: color
				}} 
				/>
			);
		}
		return (
			<Box sx={{
				width: this.props.colorWidth, 
				height: this.props.colorHeight,
				border: 1,
				borderColor: 'white',
				color: 'common.white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: color
			}}>
				<CheckIcon style={{ fontSize: this.props.checkIconFontSize }} />
			</Box>
		);
	}

	colors(){
		return this.props.palette.map((color, index)=>{
			const icon = this.radioIcon(false, color);
			const checked = this.radioIcon(true, color);
			const title = `${this.props.toolTipPrefix} ${index}`;
			const isChecked = this.props.colorSelected === index;
			return (
				<Tooltip placement="bottom" title={title} key={index}>
					<Paper sx={{m:0.4}}>
						<Radio sx={{ p: 0 }} color="default" name="color-select" value={index} checked={isChecked} icon={icon} checkedIcon={checked} onChange={this.selected} />
					</Paper>
				</Tooltip>
			);
		});
	}

	render() {
		return (
			<Box sx={{display: 'flex', flexWrap: 'wrap'}}>{this.colors()}</Box>
		);
	}
}

ColorPalette.defaultProps = {
	palette: null,
	toolTipPrefix: "",
	colorSelected: -1,
	onSelected: null,
	colorWidth: 32,
	colorHeight: 32,
	checkIconFontSize: 30
}

ColorPalette.propTypes = {
	palette: PropTypes.arrayOf(PropTypes.string),
	toolTipPrefix: PropTypes.string,
	colorSelected: PropTypes.number,
	onSelected: PropTypes.func,
	colorWidth: PropTypes.number,
	colorHeight: PropTypes.number,
	checkIconFontSize: PropTypes.number
};

export default ColorPalette;