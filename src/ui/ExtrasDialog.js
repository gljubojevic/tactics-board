import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Goal from '../editors/Goal';
import Ladder from '../editors/Ladder';
import Cone from '../editors/Cone';
import Flag from '../editors/Flag';
import { ExtrasDefaults, ExtrasType } from '../pitch/Constants';
import withStyles from '@mui/styles/withStyles';
import Dialog from '@mui/material/Dialog';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogContent from '@mui/material/DialogContent';
import Radio from '@mui/material/Radio';
import SvgIcon from '@mui/material/SvgIcon';

const styles = theme => ({
	radio: {
		padding: 0,
	},
	radioIcon: {
		width: 100,
		height: 100,
	}
})

class ExtrasDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.extrasChange = this.extrasChange.bind(this);
	}

	Show() {
		this.setState({open: true});
	}

	handleClose() {
		this.setState({open: false});
	}

	extrasChange(e) {
		if (this.props.extrasCreate) {
			let t = parseInt(e.target.value);
			const def = ExtrasDefaults[t];
			this.props.extrasCreate(t, def.width, def.height);
		}
		this.handleClose();
	}

	getExtrasGfx(extrasType) {
		const def = ExtrasDefaults[extrasType];
		const x = def.width / 2 * def.viewBoxScale;
		const y = def.height / 2 * def.viewBoxScale;
		switch (extrasType) {
			case ExtrasType.Goal:
			case ExtrasType.GoalSmall:
				return (<Goal x={x} y={y} width={def.width} height={def.height} />);
			case ExtrasType.Ladder:
				return (<Ladder x={x} y={y} width={def.width} height={def.height} />);
			case ExtrasType.Cone:
				return (<Cone x={x} y={y} width={def.width} height={def.height} />);
			case ExtrasType.Flag:
				return (<Flag x={x} y={y} width={def.width} height={def.height} />);
			default:
				throw new Error("Unknown extras type");
		}
	}

	radioIcon(extrasType) {
		const def = ExtrasDefaults[extrasType];
		const viewBox = `0 0 ${def.width * def.viewBoxScale} ${def.height * def.viewBoxScale}`;
		return (
			<SvgIcon viewBox={viewBox} className={this.props.classes.radioIcon}>
				{this.getExtrasGfx(extrasType)}
			</SvgIcon>
		);
	}

	renderRadios() {
		const allExtras = [ExtrasType.Goal, ExtrasType.GoalSmall, ExtrasType.Ladder, ExtrasType.Cone, ExtrasType.Flag];
		return allExtras.map((val, index) => {
			const ico = this.radioIcon(val);
			const def = ExtrasDefaults[val];
			return (
				<div key={index} style={{display: 'inline-block'}}>
					<label style={{display: 'block',  textAlign: "center"}}>{def.name}</label>
					<Radio name="extras-select" value={val} className={this.props.classes.radio} icon={ico} onChange={this.extrasChange} />
				</div>
			);
		});
	}

	render() {
		return (
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Select element to place on pitch</DialogTitleClose>
				<DialogContent dividers>
					{this.renderRadios()}
				</DialogContent>
			</Dialog>
		);
	}
}

ExtrasDialog.defaultProps = {
	extrasCreate: null,
}

ExtrasDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	extrasCreate: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(ExtrasDialog);