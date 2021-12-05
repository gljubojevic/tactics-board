import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ColorPalette from './elements/ColorPalette';
import DialogTitleClose from './elements/DialogTitleClose';

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
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Draw color palette</DialogTitleClose>
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