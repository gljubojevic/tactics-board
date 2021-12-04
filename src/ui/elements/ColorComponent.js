import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';

class ColorComponent extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			value: props.value
		}
		this.sliderChange = this.sliderChange.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.inputBlur = this.inputBlur.bind(this);
		this.changed = this.changed.bind(this);
	}

	componentDidUpdate() {
		if (this.props.value !== this.state.value) {
			this.setState({value:this.props.value});
		}
	}

	changed(newValue) {
		this.setState({value:newValue});
		if (null === this.props.onChange) {
			return;
		}
		if (typeof this.state.value === 'number') {
			this.props.onChange(newValue);
		}
	}

	sliderChange(event, newValue) {
		this.changed(newValue);
	}

	inputChange(event) {
		console.log("Input change",event.target.value);
		let newValue = event.target.value === '' ? '' : Number(event.target.value);
		this.changed(newValue);
	}

	numberValue() {
		return typeof this.state.value === 'number' ?  this.state.value : 0;
	}

	// this is only to set defaults when input text is invalid
	inputBlur() {
		let newValue = this.numberValue();
		if (newValue < 0) {
			newValue = 0;
		} else if (newValue > 255) {
			newValue = 255;
		}
		this.changed(newValue);
	}
	
	render() {
		const id = "input-slider-" + this.props.label;
		return (
			<Box sx={{display: 'flex', alignItems: 'center', mt:2}}>
				<Typography id={id} sx={{ width: 55}} component="div">{this.props.label}</Typography>
				<Slider sx={{ width: 'calc(100% - 110px)', ml: 2, mr: 2 }}
					min={0} max={255} step={1} 
					valueLabelDisplay="auto" 
					value={this.numberValue()} 
					onChange={this.sliderChange}
					aria-labelledby={id}
				/>
				<Input sx={{ width: 55}}
					value={this.state.value}
					size="small"
					onChange={this.inputChange}
					onBlur={this.inputBlur}
					inputProps={{
						min: 0, max: 255, step: 1,
						type: 'number',
						'aria-labelledby': id
					}}
				/>
			</Box>
		);
	}
}

ColorComponent.defaultProps = {
	value: 0,
	label: "",
	onChange: null
}

ColorComponent.propTypes = {
	value: PropTypes.number,
	label: PropTypes.string,
	onChange: PropTypes.func
};

export default ColorComponent;