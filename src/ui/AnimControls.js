import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MovieIcon from '@material-ui/icons/Movie';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import LoopIcon from '@material-ui/icons/Loop';
class AnimControls extends Component {
	

    render(){
        const word="Hello World";
        return (
            <div >
                <div  style={{float:"left"}}>
                  <IconButton edge="end" color="inherit">
                    <ArrowBackIcon />
                </IconButton>
                <IconButton color="inherit" >
                    <MovieIcon fontSize="large"/>
                </IconButton>
                
                <IconButton edge="start" color="inherit" >
                    <ArrowForwardIcon />
                </IconButton>
                </div>

                <div style={{float:'right'}}>
                <IconButton color="inherit">
                    <PlayArrowIcon fontSize="large" />
                </IconButton>
                <IconButton color="inherit" >
                    <PauseIcon fontSize="large"/>
                </IconButton>
                
                <IconButton  color="inherit" >
                    <StopIcon fontSize="large"/>
                </IconButton>
                <IconButton color="inherit" >
                    <LoopIcon fontSize="large"/>
                </IconButton>
                </div>
            </div>
        );
    }

}

export default AnimControls;