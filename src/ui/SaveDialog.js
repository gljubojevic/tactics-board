import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class SaveDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.refName = React.createRef();

		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.nameChange = this.nameChange.bind(this);
		this.nameBlur = this.nameBlur.bind(this);
		this.descriptionChange = this.descriptionChange.bind(this);
		this.state = {
			open: false,
			name: "",
			description: "",
			saveAs: false,
			errors:{}
		}
	}

	Show(name, description, saveAs) {
		this.setState({
			open: true,
			name: name,
			description: description,
			saveAs: saveAs,
			errors:{}
		});
	}
	
	handleClose() {
		this.setState({open: false});
	}

	handleOk() {
		// do validation
		if (!this.isValid()) {
			console.log("Invalid save data",this.state.errors);
			return;
		}
		// handle result
		this.handleClose();
		this.props.onSave(
			this.state.name.trim(),
			this.state.description.trim(),
			this.state.saveAs
		);
	}

	isValid() {
		const err = this.state.errors;
		for (const id in err) {
			if (!Object.hasOwnProperty.call(err, id)) {
				continue;
			}
			if (err[id].trim().length > 0) {
				return false;
			} 
		}
		return true;
	}

	isValidRequired(target, errorText) {
		let err = this.state.errors;
		let isValid = true;
		err[target.id] = "";
		if (target.value.trim().length === 0) {
			err[target.id] = errorText;
			isValid = false;
		}
		this.setState({ errors: err });
		return isValid;
	}

	nameChange(e) {
		this.setState({name:e.target.value})
	}

	nameBlur(e) {
		this.isValidRequired(e.target, "Name is required")
	}

	descriptionChange(e) {
		this.setState({description:e.target.value})
	}

	render() {
		return (
			<Dialog fullWidth={true} maxWidth={"sm"} open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>{this.state.saveAs ? "Save as new" : "Save"} tactics board</DialogTitleClose>
				<DialogContent dividers>
					<TextField 
						ref={this.refName}
						id="name-required"
						label="Name"
						placeholder="Please enter tactics name"
						value={this.state.name}
						onChange={this.nameChange}
						onBlur={this.nameBlur}
						error={"" !== this.state.errors["name-required"]}
						helperText={this.state.errors["name-required"]}
						margin="dense" required fullWidth autoFocus />
					<TextField 
						id="description-optional" 
						label="Description (optional)" 
						placeholder="Short tactics description" 
						value={this.state.description}
						onChange={this.descriptionChange}
						margin="dense" multiline rows={4} fullWidth />
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
					<Button onClick={this.handleOk} variant="contained" color="secondary">Ok</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

SaveDialog.defaultProps = {
	onSave: null
}

SaveDialog.propTypes = {
	onSave: PropTypes.func
}

export default SaveDialog;