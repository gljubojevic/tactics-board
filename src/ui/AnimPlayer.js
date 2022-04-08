import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import withStyles from '@mui/styles/withStyles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import Pause from '@mui/icons-material/Pause';
import SkipNext from '@mui/icons-material/SkipNext';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import Repeat from '@mui/icons-material/Repeat';
import RepeatOn from '@mui/icons-material/RepeatOn';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: 10,
		borderRadius: 5,
		width: 250
	},
	bar: {
		borderRadius: 5,
		transition: 'none'	// disable animation to have immediate feedback
	}
}))(LinearProgress);
  

class AnimPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			isPlaying: false,
			isRepeat: false,
			animTime: 0
		}
		this.currentTime = 0;
		this.show = this.show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.playPause = this.playPause.bind(this);
		this.stop = this.stop.bind(this);
		this.animStep = this.animStep.bind(this);
		this.showPaths = this.showPaths.bind(this);
		this.repeatToggle = this.repeatToggle.bind(this);
		this.keyFrameNext = this.keyFrameNext.bind(this);
		this.keyFramePrevious = this.keyFramePrevious.bind(this);
	}

	show() {
		this.setState({ 
			isOpen: true,
			isPlaying: false,
			isRepeat: false,
			animTime: 0
		});
		// Prepare animation for playback
		if (null != this.props.animStart) {
			this.props.animStart();
		}
		// reset current time so anim can start from beginning
		this.currentTime = 0;
		// start animation frames
		window.requestAnimationFrame(this.animStep);
	}

	handleClose() {
		// close player
		this.setState({
			isOpen: false,
			isPlaying: false,
			isRepeat: false,
			animTime: 0
		});
		// stop / cancel anim playback
		if (null != this.props.animStop) {
			this.props.animStop();
		}
	}

	repeatToggle() {
		this.setState({
			isRepeat: !this.state.isRepeat
		});
	}

	showPaths(e) {
		if (null !== this.props.animShowPaths) {
			this.props.animShowPaths(e.target.checked);
		}
	}

	playPause() {
		this.setState({
			isPlaying: !this.state.isPlaying
		});
	}

	stop() {
		this.setState({
			isPlaying: false,
			animTime: 0
		});
	}

	keyFrameDurationMs() {
		return this.props.keyFrameDuration * 1000;
	}

	keyFrameLast() {
		return this.props.keyFramesNo - 1;
	}

	keyFramePreviousDisabled() {
		return 0 === this.state.animTime;
	}

	keyFramePrevious() {
		const kfDuration = this.keyFrameDurationMs();
		let animTime = this.state.animTime - kfDuration;
		if (animTime < 0) {
			animTime = 0;
		}
		animTime = Math.floor(animTime / kfDuration) * kfDuration;
		this.setState({
			animTime: animTime
		});
	}

	keyFrameNextDisabled() {
		return this.state.animTime >= this.animTotalTime();
	}

	keyFrameNext() {
		const kfDuration = this.keyFrameDurationMs();
		const totalTime = this.animTotalTime();
		let animTime = this.state.animTime + kfDuration;
		if (animTime > totalTime) {
			animTime = totalTime;
		}
		animTime = Math.floor(animTime / kfDuration) * kfDuration;
		this.setState({
			animTime: animTime
		});
	}

	animTotalTime() {
		// note: first keyframe is only initial position so it is skipped
		// total time is in milliseconds
		return this.keyFrameLast() * this.keyFrameDurationMs();
	}

	animProgress() {
		let animTime = this.state.animTime;
		let pct = 100 * animTime / this.animTotalTime();
		return Math.round(pct);
	}

	animTime() {
		let timeSec = this.state.animTime / 1000;
		let sec = Math.floor(timeSec).toString();
		let msec = Math.floor((timeSec - sec) * 1000).toString();
		// correct formatting '000:000'
		sec = '000'.substring(0, 3 - sec.length) + sec;
		msec = '000'.substring(0, 3 - msec.length) + msec;
		return sec + ':' + msec;
	}

	animStep(time) {
		// calc elapsed time from previous frame
		const elapsedTime = time - this.currentTime;
		this.currentTime = time;

		const totalTime = this.animTotalTime();
		let animTime = this.state.animTime;

		if (this.state.isPlaying) {
			animTime += elapsedTime;
			if (animTime > totalTime) {
				if (this.state.isRepeat) {
					animTime = 0;
				} else {
					animTime = totalTime;
				}
			}
			this.setState({
				animTime: animTime
			})
		}

		if (this.state.isOpen) {
			// show current frame only when anim time changed
			if (null != this.props.animFrame) {
				this.props.animFrame(animTime);
			}
			// request next frame
			window.requestAnimationFrame(this.animStep);
		}
	}

	renderRepeat() {
		if (this.state.isRepeat) {
			return (<RepeatOn />);
		}
		return (<Repeat />);
	}

	renderPlayPause() {
		if (this.state.isPlaying) {
			return (<Pause />);
		}
		return (<PlayArrow />);
	}

	stopDisabled() {
		return 0 === this.state.animTime;
	}

	render() {
		return (
			<Popover open={this.state.isOpen}
				onClose={this.handleClose}
				anchorEl={this.props.anchorEl}
				anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
				transformOrigin={{horizontal: 'center', vertical: 'top'}}
			>
				<Grid container alignItems="center">
					<Grid item>
						<FormControlLabel control={<Switch checked={this.props.pathsVisible} onChange={this.showPaths} />} labelPlacement="start" label="Paths" />
						<Tooltip title="Repeat Animation">
							<IconButton aria-label="Repeat Animation" color="inherit" onClick={this.repeatToggle}>
								{this.renderRepeat()}
							</IconButton>
						</Tooltip>
						<Tooltip title="Previous key frame">
							<span>
								<IconButton aria-label="Previous key frame" color="inherit" onClick={this.keyFramePrevious} disabled={this.keyFramePreviousDisabled()}>
									<SkipPrevious />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title="Play/Pause Animation">
							<IconButton aria-label="Play/Pause Animation" color="inherit" onClick={this.playPause}>
								{this.renderPlayPause()}
							</IconButton>
						</Tooltip>
						<Tooltip title="Next key frame">
							<span>
								<IconButton aria-label="Previous key frame" color="inherit" onClick={this.keyFrameNext} disabled={this.keyFrameNextDisabled()}>
									<SkipNext />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title="Stop Animation">
							<span>
								<IconButton aria-label="Stop Animation" color="inherit" onClick={this.stop} disabled={this.stopDisabled()}>
									<Stop />
								</IconButton>
							</span>
						</Tooltip>
					</Grid>
					<Grid item>
						<Box display="flex" alignItems="center">
							<Box mr={1} minWidth={55}>
								<Typography variant="body2" color="textSecondary">{this.animTime()}</Typography>
							</Box>
							<Box mr={1}>
								<BorderLinearProgress variant="determinate" value={this.animProgress()} />
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Popover>
		);
	}
}

AnimPlayer.defaultProps = {
	anchorEl: null,
	keyFramesNo: 0,
	keyFrameDuration: 0,
	pathsVisible: false,
	animStart: null,
	animStop: null,
	animFrame: null,
	animShowPaths: null
}

AnimPlayer.propTypes = {
	anchorEl: PropTypes.func,
	keyFramesNo: PropTypes.number,
	keyFrameDuration: PropTypes.number,
	pathsVisible: PropTypes.bool,
	animStart: PropTypes.func,
	animStop: PropTypes.func,
	animFrame: PropTypes.func,
	animShowPaths: PropTypes.func
}

export default AnimPlayer;