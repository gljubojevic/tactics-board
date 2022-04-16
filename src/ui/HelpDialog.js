import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
// Main tools icons
import CursorDefault from 'mdi-material-ui/CursorDefault';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LinkIcon from '@mui/icons-material/Link';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
// Drawer menu icons
import OpenInNew from '@mui/icons-material/OpenInNew';
import MovieCreation from '@mui/icons-material/MovieCreation';
import Delete from '@mui/icons-material/Delete';
import Save from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Palette from '@mui/icons-material/Palette';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// Draw tools
import VectorLine from 'mdi-material-ui/VectorLine';
import ShapeSquarePlus from 'mdi-material-ui/ShapeSquarePlus';
import ShapeOvalPlus from 'mdi-material-ui/ShapeOvalPlus';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import ArrowRight from 'mdi-material-ui/ArrowRight';
import Minus from 'mdi-material-ui/Minus';
import DotsHorizontal from 'mdi-material-ui/DotsHorizontal';
import TextFields from '@mui/icons-material/TextFields';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
// Animation tool
import Movie from '@mui/icons-material/Movie';
import Add from '@mui/icons-material/Add';


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
					<p><b>To use saving and loading options you need to be registered user.</b></p>
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
					<h2>App Tools</h2>
					<p>At upper right corner of a screen are main tools, icons from left to right are:</p>
					<ul>
						<li><CursorDefault/> Current drawing mode</li>
						<li><HelpCenterIcon/> Help</li>
						<li><LinkIcon/> Sharing tool, active once visualization is saved</li>
						<li><FullscreenIcon/> Enter / Exit fullscreen</li>
						<li><Avatar>GL</Avatar> Current active user</li>
					</ul>
					<h3><CursorDefault/> Drawing mode</h3>
					<p>This menu has all drawing and editing tools, available</p>
					<ul>
						<li><CursorDefault/> <b>Select / Move</b> for selecting and moving elements on pitch</li>
						<li><Delete/> <b>Remove</b> removes only one element and switches back to Select / Move tool</li>
						<li><b>Pitch overlay</b> is rectangle showing different sizes of on top of futsal pitch,<br /> available options are
							<ul>
								<li><b>None</b> no overlay selected</li>
								<li><b>Exercise</b> smaller exercise pitch</li>
								<li><b>Basketball</b> court</li>
								<li><b>Volleyball</b> court</li>
							</ul>
						</li>
						<li><SportsSoccer/> <b>Extras</b> are optional elements that can be placed on pitch
							<ul>
								<li>Goal</li>
								<li>Small goal</li>
								<li>Ladder</li>
								<li>Cone</li>
								<li>Flag</li>
							</ul>
						</li>
						<li><Palette/> <b>Color</b> currently selected drawing color</li>
						<li><VectorLine/> <b>Draw line</b> is for drawing lines and curves, each line can be modified to be curve,<br />
							Lines and curves can have arrows:<br />
							<ul>
								<li><ArrowRight/> At end</li>
								<li><ArrowLeft/> At start</li>
							</ul>
							Line pattern can be:
							<ul>
								<li><Minus /> Solid</li>
								<li><DotsHorizontal /> Dashed</li>
							</ul>
						</li>
						<li><ShapeSquarePlus/> <b>Draw square</b> draws square, when holding shift key draws square same width and height</li>
						<li><ShapeOvalPlus/> <b>Draw ellipse</b> draws ellipse, when holding shift key draws circle</li>
						<li><TextFields /> <b>Write text</b> enables adding text labels, that can be in different sizes:
							<ul>
								<li>Extra small</li>
								<li>Small</li>
								<li>Normal</li>
								<li>Large</li>
								<li>Extra large</li>
							</ul>
						</li>
					</ul>
					<p>Every element can be modified using select / move tool, use right mouse button to select edit on element, options are:</p>
					<ul>
						<li>Moved</li>
						<li>Resized</li>
						<li>Rotated</li>
					</ul>
					<p><b>NOTE:</b> Some elemets like goals, small goals or cones can't be resized because they have fixed size.</p>

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

					<h2>Animation</h2>
					<p>As already stated only players and balls are animated elements, all other elements are static.</p>
					<p>Animation consists of key frames, each key frame has position of balls and players.</p>
					<p>When player or ball have different position in two key frames path is shown between positions.<br/>
					During playback player or ball is moved along displayed path.<br />
					When editing animation previous key frame positions of player or ball is shown with transparency to have slight distinction on currently active key frame.
					</p>
					<p>Animation tool is shown when animation is created from main menu and consists of:</p>
					<ul>
						<li>Key frame navigation <ArrowLeft/> currently visible key frame <ArrowRight/></li>
						<li>Key frame <Add/> add and <Delete/> delete icons</li>
						<li>Key frame duration selection in seconds, that is for each key frame in animation</li>
						<li><Movie /> Playback start button that opens playback control</li>
					</ul>
					<p>Animation playback tool is simple and self explanatory.</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
	  	);
	}
}

export default HelpDialog;