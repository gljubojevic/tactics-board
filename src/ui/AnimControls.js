import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import LoopIcon from '@material-ui/icons/Loop';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import PitchFutsal from '../pitch/PitchFutsal';

class AnimControls extends Component {

	constructor(props) {
		super(props);
		this.keyFrameAdd = this.keyFrameAdd.bind(this);
		this.keyFrameNext = this.keyFrameNext.bind(this);
		this.keyFramePrevious = this.keyFramePrevious.bind(this);
	}

	keyFrameAdd() {
		if (this.props.pitch.animKeyFrameAdd()){
			this.props.snackbarOpen("success", "New key frame added to animation");
		} else {
			this.props.snackbarOpen("error", "Can't add new key frame no change is done to current key frame");
		}
	}

	keyFrameNext() {
		if (!this.props.pitch.animKeyFrameNext()) {
			this.props.snackbarOpen("warning", "No more key frames to navigate");
		}
	}

	keyFramePrevious() {
		if (!this.props.pitch.animKeyFramePrevious()) {
			this.props.snackbarOpen("warning", "You are on first key frame");
		}
	}

    render(){
    
        return (
            <div >
                <div  style={{float:"left"}}>

                <Tooltip title="Previous Frame">
                  <IconButton edge="end" color="inherit" aria-label="Previous Frame" onClick={this.keyFramePrevious} >
                    <ArrowBackIcon/>
                </IconButton>
                </Tooltip>
                
                <Tooltip title="Current Frame">
                <IconButton color="inherit" aria-label="Current Frame">
                    {this.props.pitch.AnimKeyFrameCurrent}
                </IconButton>
                </Tooltip>
                
                <Tooltip title="Next Frame">
                <IconButton edge="start" color="inherit" aria-label="Next Frame" onClick={this.keyFrameNext} >
                    <ArrowForwardIcon />
                </IconButton>
                </Tooltip>

                <Tooltip title="Add Frame">
                <IconButton color="inherit" aria-label="Add Frame" onClick={this.keyFrameAdd} >
                    <AddIcon  fontSize="large"></AddIcon>
                </IconButton>
                </Tooltip>

                </div>
                
                <div style={{float:'right'}}>

                <Tooltip title="Play Animation">
                <IconButton aria-label="Play Animation" color="inherit">
                    <PlayArrowIcon fontSize="large" />
                </IconButton>
                </Tooltip>

                <Tooltip title="Pause Animation">
                <IconButton aria-label="Pause Animation" color="inherit" >
                    <PauseIcon fontSize="large"/>
                </IconButton>
                </Tooltip>
                
                <Tooltip title="Stop Animation">
                <IconButton aria-label="Stop Animation" color="inherit" >
                    <StopIcon fontSize="large"/>
                </IconButton>
                </Tooltip>
                
                <Tooltip title="Loop Animation">
                <IconButton  aria-label="Loop Animation" color="inherit" >
                    <LoopIcon fontSize="large"/>
                </IconButton>
                </Tooltip>

                </div>
            </div>
        );
    }
    
}

AnimControls.defaultProps = {
	pitch: null,
	snackbarOpen: null
}

AnimControls.propTypes = {
	pitch: PropTypes.instanceOf(PitchFutsal),
	snackbarOpen: PropTypes.func
}

export default AnimControls;