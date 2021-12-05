import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ColorPalette from './elements/ColorPalette';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

class PaletteDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.colorSelected = this.colorSelected.bind(this);
	}

	Show() {
		this.setState({ open: true });
	}

	handleClose() {
		this.setState({ open: false });
	}

	colorSelected(index, color) {
		this.props.drawMode.color = index;
		this.handleClose();
	}

	render() {
		return (
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitle id="responsive-dialog-title">Draw color palette
					<IconButton aria-label="close" onClick={this.handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<ColorPalette toolTipPrefix="Color" colorWidth={48} colorHeight={48} palette={this.props.drawMode.colorOptions} colorSelected={this.props.drawMode.color} onSelected={this.colorSelected} />
				</DialogContent>
			</Dialog>
		);
	}
}

PaletteDialog.defaultProps = {
	drawMode: null
}

PaletteDialog.propTypes = {
	drawMode: PropTypes.instanceOf(DrawMode)
};

export default PaletteDialog;