import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

class ShareDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.state = {
			open: false
		}
	}

	Show() {
		this.setState({
			open: true,
		});
	}
	
	handleClose() {
		this.setState({open: false});
	}

	render() {
		return (
			<Dialog fullWidth={true} maxWidth="lg" open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Share tactics</DialogTitleClose>
				<DialogContent dividers>
					nema
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

ShareDialog.defaultProps = {
	tacticsID: null,
	tacticsName: null,
	tacticsDescription: null
}

ShareDialog.propTypes = {
	tacticsID: PropTypes.string,
	tacticsName: PropTypes.string,
	tacticsDescription: PropTypes.string,
}

export default ShareDialog;