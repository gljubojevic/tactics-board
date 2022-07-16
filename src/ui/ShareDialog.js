import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Tooltip from '@mui/material/Tooltip';

class ShareDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.copyLink = this.copyLink.bind(this);
		this.toolTipExited = this.toolTipExited.bind(this);
		this.state = {
			open: false,
			id: "",
			name: "",
			description: "",
			copied: false
		}
	}

	Show(id, name, description) {
		this.setState({
			open: true,
			id: id,
			name: name,
			description: description,
			copied: false
		});
	}
	
	handleClose() {
		this.setState({open: false});
	}

	copyLink() {
		const lnk = document.location + '?ts=' + this.state.id;
		navigator.clipboard.writeText(lnk)
		this.setState({copied: true});
	}

	toolTipExited() {
		this.setState({copied: false});
	}

	render() {
		const lnk = document.location + '?ts=' + this.state.id;
		const tooltipTitle = this.state.copied ? "copied" : "click to copy"
		return (
			<Dialog fullWidth={false} maxWidth="md" open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Share tactics</DialogTitleClose>
				<DialogContent dividers>
					<Stack spacing={2}>
						<Tooltip placement="top" title={tooltipTitle} TransitionProps={{ onExited: this.toolTipExited }} >
							<Button variant="outlined" endIcon={<CopyAllIcon />} onClick={this.copyLink} sx={{textTransform:"none"}} >{lnk}</Button>
						</Tooltip>
						<Typography component="div" variant="h6">{this.state.name}</Typography>
						<Typography component="div" variant="body2">{this.state.description}</Typography>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default ShareDialog;