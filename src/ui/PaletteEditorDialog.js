import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import ColorPalette from './elements/ColorPalette';
import ColorEditor from './elements/ColorEditor';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

class PaletteEditorDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.drawColorSelected = this.drawColorSelected.bind(this);
		this.playerColorSelected = this.playerColorSelected.bind(this);
		this.ballColorSelected = this.ballColorSelected.bind(this);
		this.colorChanged = this.colorChanged.bind(this);
	}

	Show() {
		// on show reset selection
		this.setState({
			open: true,
			selPaletteType: "draw",
			selPaletteIndex: 0,
			drawPalette: this.props.drawMode.colorOptions,
			playersPalette: this.props.drawMode.colorOptionsPlayer,
			ballsPalette: this.props.drawMode.colorOptionsBall
		})
	}

	handleClose() {
		this.setState({open: false});
	}

	handleOk() {
		this.handleClose();
		this.props.drawMode.updateColors(
			this.state.drawPalette, 
			this.state.playersPalette, 
			this.state.ballsPalette
		);
	}

	drawColorSelected(index) {
		this.setState({ selPaletteType: "draw", selPaletteIndex: index });
	}

	playerColorSelected(index) {
		this.setState({ selPaletteType: "player", selPaletteIndex: index });
	}

	ballColorSelected(index) {
		this.setState({ selPaletteType: "ball", selPaletteIndex: index });
	}

	selectedInPalette(paletteType) {
		return this.state.selPaletteType === paletteType ? this.state.selPaletteIndex : -1;
	}

	colorForEdit() {
		switch (this.state.selPaletteType) {
			case "draw":
				return this.state.drawPalette[this.state.selPaletteIndex];
			case "player":
				return this.state.playersPalette[this.state.selPaletteIndex];
			case "ball":
				return this.state.ballsPalette[this.state.selPaletteIndex];
			default:
				return "#000000";
		}
	}

	updatePalette(palette, newColor) {
		return palette.map((c,index) => {
			if (index === this.state.selPaletteIndex) {
				return newColor;
			}
			return c;
		});
	}

	colorChanged(newColor) {
		switch (this.state.selPaletteType) {
			case "draw":
				this.setState({
					drawPalette: this.updatePalette(this.state.drawPalette, newColor)
				});
				break;
			case "player":
				this.setState({
					playersPalette: this.updatePalette(this.state.playersPalette, newColor)
				});
				break;
			case "ball":
				this.setState({
					ballsPalette: this.updatePalette(this.state.ballsPalette, newColor)
				});
				break;
			default:
				console.error("Invalid palette type", this.state.selPaletteType);
				break;
		}
	}

	render() {
		return (
			<Dialog maxWidth="lg" fullWidth={false} open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Color palette editor</DialogTitleClose>
				<DialogContent dividers>
					<Box sx={{display: 'flex', flexWrap: 'nowrap'}}>
						<Box sx={{mr:2}}>
							<Typography variant="h6" gutterBottom component="div">Drawings</Typography>
							<ColorPalette toolTipPrefix="Color" palette={this.state.drawPalette} colorSelected={this.selectedInPalette("draw")} onSelected={this.drawColorSelected} />
							<Typography variant="h6" gutterBottom component="div">Teams</Typography>
							<ColorPalette toolTipPrefix="Team" palette={this.state.playersPalette} colorSelected={this.selectedInPalette("player")} onSelected={this.playerColorSelected} />
							<Typography variant="h6" gutterBottom component="div">Balls</Typography>
							<ColorPalette toolTipPrefix="Ball" palette={this.state.ballsPalette} colorSelected={this.selectedInPalette("ball")} onSelected={this.ballColorSelected} />
						</Box>
						<ColorEditor color={this.colorForEdit()} onChange={this.colorChanged} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
					<Button onClick={this.handleOk} variant="contained" color="secondary">Ok</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

PaletteEditorDialog.defaultProps = {
	drawMode: null
}

PaletteEditorDialog.propTypes = {
	drawMode: PropTypes.instanceOf(DrawMode)
};

export default PaletteEditorDialog;