import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import LoopIcon from '@material-ui/icons/Loop';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

class AnimControls extends Component {

    render(){
    
        return (
            <div >
                <div  style={{float:"left"}}>

                <Tooltip title="Previous Frame">
                  <IconButton edge="end" color="inherit" aria-label="Previous Frame" onClick={this.props.previousKeyFrame} >
                    <ArrowBackIcon/>
                </IconButton>
                </Tooltip>

                
                <Tooltip title="Current Frame">
                <IconButton color="inherit" aria-label="Current Frame">
                    {this.props.currentKeyFrame}
                </IconButton>
                </Tooltip>
                
                <Tooltip title="Next Frame">
                <IconButton edge="start" color="inherit" aria-label="Next Frame" onClick={this.props.nextKeyFrame} >
                    <ArrowForwardIcon />
                </IconButton>
                </Tooltip>

                <Tooltip title="Add Frame">
                <IconButton color="inherit" aria-label="Add Frame" onClick={this.props.addKeyFrame} >
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

export default AnimControls;