import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import firebase from 'firebase/compat/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class SignInDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.signInSuccessWithAuthResult = this.signInSuccessWithAuthResult.bind(this);
		this.uiConfig = {
			signInFlow: 'popup',
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID
			],
			callbacks: {
				signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
			},
		};
		
		this.state = {
			open: false
		}
	}

	Show() {
		this.setState({
			open: true
		});
	}
	
	handleClose() {
		this.setState({
			open: false
		});
	}

	signInSuccessWithAuthResult(authResult, redirectUrl) {
		console.log("SignIn success",authResult, redirectUrl);
		this.handleClose();
		return false;
	}	

	render() {
		return (
			<Dialog fullWidth={true} maxWidth={"sm"} open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitle id="responsive-dialog-title">
					<IconButton aria-label="close" onClick={this.handleClose} sx={{ position: 'absolute', right: 8,top: 8}}>
						<CloseIcon />
					</IconButton>
					Please select sign in method
				</DialogTitle>
				<DialogContent dividers>
					<StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.props.firebaseApp.auth()}/>
				</DialogContent>
			</Dialog>
		);
	}
}

SignInDialog.defaultProps = {
	firebaseApp: null
}

SignInDialog.propTypes = {
	firebaseApp: PropTypes.object,
}

export default SignInDialog;