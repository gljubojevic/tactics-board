import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

class ContextMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objectID: null, isEditable: false,
			x: 0, y: 0
		};

		// events
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}
	
	open(objectID, isEditable, x, y) {
		this.setState({objectID: objectID, isEditable: isEditable, x: x-2, y: y-4});
	}

	close(e) {
		// read from "data-value" attribute
		const op = e.currentTarget.dataset.value;
		if (op && null != this.props.onClose) {
			this.props.onClose(op, this.state.objectID);
		}
		// close menu
		this.setState({objectID: null, isEditable: false, x: 0, y: 0});
	}

	render() {
		return (
			<Menu open={this.state.objectID !== null} onClose={this.close} anchorReference="anchorPosition"
				anchorPosition={this.state.objectID !== null ? { top: this.state.y, left: this.state.x } : undefined}>
				<MenuItem data-value="edit" disabled={!this.state.isEditable} onClick={this.close}>
					<ListItemIcon><EditIcon /></ListItemIcon>
					<ListItemText primary="Edit" />
				</MenuItem>
				<Divider />
				<MenuItem data-value="delete" onClick={this.close}>
					<ListItemIcon><DeleteIcon /></ListItemIcon>
					<ListItemText primary="Remove" />
				</MenuItem>
			</Menu>
		);
	}
}

ContextMenu.defaultProps = {
	onClose: null
}

ContextMenu.propTypes = {
	onClose: PropTypes.func
}

export default ContextMenu;