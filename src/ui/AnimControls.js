import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class AnimControls extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event) {  
		this.props.keyFrameDurationSet(event.target.value)
	}

	render(){
		return (
			<React.Fragment>

				<Tooltip title="Previous Frame">
					<IconButton edge="end" color="inherit" aria-label="Previous Frame" onClick={this.props.keyFramePrevious} >
						<ArrowBackIcon fontSize="small"/>
					</IconButton>
				</Tooltip>
				<Tooltip title="Current Frame">
					<IconButton color="inherit" aria-label="Current Frame">
						{this.props.keyFrameCurrent}
					</IconButton>
				</Tooltip>
				<Tooltip title="Next Frame">
					<IconButton edge="start" color="inherit" aria-label="Next Frame" onClick={this.props.keyFrameNext} >
						<ArrowForwardIcon fontSize="small"/>
					</IconButton>
				</Tooltip>
				<Tooltip title="Add Frame">
					<IconButton color="inherit" aria-label="Add Frame" onClick={this.props.keyFrameAdd} >
						<AddIcon ></AddIcon>
					</IconButton>
				</Tooltip>

				<Tooltip title="Play Animation">
					<IconButton aria-label="Play Animation" color="inherit" onClick={this.props.animPlayerShow}>
						<PlayArrowIcon />
					</IconButton>
				</Tooltip>
				<Tooltip data-delay-hide="1000" title="Select frame duration">
				<Select
					id="frameDurationSelect"
					onChange={this.handleChange}
					defaultValue={5}>
					<MenuItem value={1}>1</MenuItem>
					<MenuItem value={3}>3</MenuItem>
					<MenuItem value={5}>5</MenuItem>
					<MenuItem value={7}>7</MenuItem>
					<MenuItem value={10}>10</MenuItem>
       			 </Select>
				</Tooltip>

			</React.Fragment>
		);
	}
}

AnimControls.defaultProps = {
	keyFrameCurrent: 0,
	keyFrameAdd: null,
	keyFrameNext: null,
	keyFramePrevious: null,
	keyFrameDurationSet: null,
	animPlayerShow: null
}

AnimControls.propTypes = {
	keyFrameCurrent: PropTypes.number,
	keyFrameAdd: PropTypes.func,
	keyFrameNext: PropTypes.func,
	keyFramePrevious: PropTypes.func,
	keyFrameDurationSet: PropTypes.func,
	animPlayerShow: PropTypes.func
}

export default AnimControls;