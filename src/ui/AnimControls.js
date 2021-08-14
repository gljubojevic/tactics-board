import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import LoopIcon from '@material-ui/icons/Loop';
import AddIcon from '@material-ui/icons/Add';

class AnimControls extends Component {

    render(){
    
        return (
            <div >
                <div  style={{float:"left"}}>
                    
                  <IconButton edge="end" color="inherit" onClick={this.props.pitch.animKeyFramePrevious.bind(this.props.pitch)} >
                    <ArrowBackIcon/>
                </IconButton>

                <IconButton color="inherit" >
                    {this.props.pitch.AnimKeyFrameCurrent}
                </IconButton>
                
                <IconButton edge="start" color="inherit"  onClick={this.props.pitch.animKeyFrameNext.bind(this.props.pitch)} >
                    <ArrowForwardIcon />
                </IconButton>

                <IconButton color="inherit" onClick={this.props.pitch.animKeyFrameAdd.bind(this.props.pitch)} >
                    <AddIcon  fontSize="large"></AddIcon>
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