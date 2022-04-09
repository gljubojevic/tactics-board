import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import CursorDefault from 'mdi-material-ui/CursorDefault';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LinkIcon from '@mui/icons-material/Link';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';

import OpenInNew from '@mui/icons-material/OpenInNew';
import MovieCreation from '@mui/icons-material/MovieCreation';
import Delete from '@mui/icons-material/Delete';
import Save from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Palette from '@mui/icons-material/Palette';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


class HelpDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.state = {
			open: false
		}
	}

	Show() {
		this.setState({open: true});
	}
	
	handleClose() {
		this.setState({open: false});
	}
	
	render() {
		return (
			<Dialog open={this.state.open} onClose={this.handleClose} scroll='paper' fullWidth={true} maxWidth="xl">
				<DialogTitleClose id="help-dialog-title" onClick={this.handleClose}>Futsal tactics board help</DialogTitleClose>
				<DialogContent dividers={true}>
					<h1>Help</h1>
					<p>Futsal tactics board is a tool for visualizing practice exercises or game tactics, includes option to make static or animated visualization.</p>
					<p>Pitch is scaled version of real futsal pitch.</p>
					<h2><MenuIcon />Main menu</h2>
					<p>Located at upper left corner has following options</p>
					<ul>
						<li><OpenInNew/> <b>New</b> visualization to default state, and create new</li>
						<li><MovieCreation/> <b>Add animation</b> adds animation, available when visualization doesn't have it.</li>
						<li><Delete/> <b>Remove animation</b> removes animation from visualization leaving only first frame for static display</li>
						<li><CloudDownloadIcon/> <b>Browse my animations</b> opens dialog for loading / deleting already saved visualizations</li>
						<li><Save/> <b>Save</b> saves visualization to your user account, available only when logged in</li>
						<li><PhotoCamera /> <b>Screenshot</b> saves screenshot</li>
						<li><Palette/> <b>Color palette</b> opens color editor for players, balls and extra elements</li>
					</ul>
					<h2>Tools</h2>
					<p>At upper right corner of a screen are main tools, icons from left to right are:</p>
					<ul>
						<li><CursorDefault/> Drawing mode</li>
						<li><HelpCenterIcon/> Help</li>
						<li><LinkIcon/> Sharing tool, active once visualization is saved</li>
						<li><FullscreenIcon/> Enter / Exit fullscreen</li>
						<li><Avatar>GL</Avatar> Current active user</li>
					</ul>
					<h2>Players and balls</h2>
					<p>Located at lower left corner of a screen from left to right are:</p>
					<ul>
						<li>Players</li>
						<li>Balls (right next to players)</li>
					</ul>
					<p>Players and balls can be dragged to desired location on pitch. Simply click on a player or a ball using left mouse button and drag it to desired location.<br/>
					<b>NOTE:</b> Players and balls are only elements that can be animated.</p>
					<p>Right click on player placed at pitch opens dialog to:</p>
					<ul>
						<li>Assign player name</li>
						<li>Assign player number</li>
						<li>Remove player from pitch</li>
					</ul>
					<p>Right click on ball placed at pitch allows removing ball from pitch.</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
	  	);
	}
}

export default HelpDialog;