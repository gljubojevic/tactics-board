import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import OpenInNew from '@mui/icons-material/OpenInNew';
import MovieCreation from '@mui/icons-material/MovieCreation';
import Delete from '@mui/icons-material/Delete';
import Save from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Palette from '@mui/icons-material/Palette';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

class DrawerMenu extends Component {
	constructor(props) {
		super(props);
		this.ToggleDrawer = this.ToggleDrawer.bind(this);
		this.newScheme = this.newScheme.bind(this);
		this.newAnimation = this.newAnimation.bind(this);
		this.deleteAnimation = this.deleteAnimation.bind(this);
		this.load = this.load.bind(this);
		this.save = this.save.bind(this);
		this.saveAs = this.saveAs.bind(this);
		this.saveImage = this.saveImage.bind(this);
		this.colorPaletteEdit = this.colorPaletteEdit.bind(this);
		this.state = {
			drawerOpen: false
		}
	}

	setDrawer(isOpen) {
		this.setState({
			drawerOpen:isOpen
		});
	}

	ToggleDrawer(e) {
		if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
			return;
		}
		this.setDrawer(!this.state.drawerOpen);
	}

	newScheme() {
		this.setDrawer(false);
		this.props.newScheme();
	}

	newAnimation() {
		this.setDrawer(false);
		this.props.newAnimation();
	}

	deleteAnimation() {
		this.setDrawer(false);
		this.props.deleteAnimation();
	}

	load() {
		this.setDrawer(false);
		this.props.load();
	}

	save() {
		this.setDrawer(false);
		this.props.save();
	}

	saveAs() {
		this.setDrawer(false);
		this.props.saveAs();
	}

	saveImage() {
		this.setDrawer(false);
		this.props.saveImage();
	}

	colorPaletteEdit() {
		this.setDrawer(false);
		this.props.colorPaletteEdit();
	}

	render() {
		return (
			<Drawer anchor="left" open={this.state.drawerOpen} onClose={this.ToggleDrawer}>
				<Box p={2}>
					<Typography variant="h4" component="h2">Tactics board</Typography>
					<Divider />
					<List component="nav" aria-label="main mailbox folders">
						<ListItem>
							<ListItemButton onClick={this.newScheme}>
								<ListItemIcon><OpenInNew /></ListItemIcon>
								<ListItemText primary="New" />
							</ListItemButton>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemButton onClick={this.newAnimation} disabled={this.props.animExists}>
								<ListItemIcon><MovieCreation /></ListItemIcon>
								<ListItemText primary="Add animation" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton onClick={this.deleteAnimation} disabled={!this.props.animExists}>
								<ListItemIcon><Delete /></ListItemIcon>
								<ListItemText primary="Remove animation" />
							</ListItemButton>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemButton onClick={this.load} disabled={!this.props.isSignedIn}>
								<ListItemIcon><CloudDownloadIcon /></ListItemIcon>
								<ListItemText primary="Browse my animations" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton onClick={this.save} disabled={!this.props.isSignedIn}>
								<ListItemIcon><Save /></ListItemIcon>
								<ListItemText primary="Save" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton onClick={this.saveAs} disabled={!this.props.isSignedIn}>
								<ListItemIcon><Save /></ListItemIcon>
								<ListItemText primary="Save As" />
							</ListItemButton>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemButton onClick={this.saveImage} disabled={!this.props.isSignedIn}>
								<ListItemIcon><PhotoCamera /></ListItemIcon>
								<ListItemText primary="Screenshot" />
							</ListItemButton>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemButton onClick={this.colorPaletteEdit}>
								<ListItemIcon><Palette /></ListItemIcon>
								<ListItemText primary="Color palette" />
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		);
	}
}

DrawerMenu.defaultProps = {
	load: null,
	save: null,
	saveAs: null,
	saveImage: null,
	newScheme: null,
	newAnimation: null,
	deleteAnimation: null,
	colorPaletteEdit: null,
	animExists: false,
	isSignedIn: false
}

DrawerMenu.propTypes = {
	load: PropTypes.func,
	save: PropTypes.func,
	saveAs: PropTypes.func,
	saveImage: PropTypes.func,
	newScheme: PropTypes.func,
	newAnimation: PropTypes.func,
	deleteAnimation: PropTypes.func,
	colorPaletteEdit: PropTypes.func,
	animExists: PropTypes.bool,
	isSignedIn: PropTypes.bool
}

export default DrawerMenu;