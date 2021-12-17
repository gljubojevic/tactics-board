import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { fbList } from '../firebaseSDK';

class BrowseDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.loadTactics = this.loadTactics.bind(this);
		this.state = {
			open: false,
			tactics: [null]
		}
	}

	Show() {
		this.setState({
			open: true,
			tactics: [null]
		});
		this.firebaseList();
	}
	
	handleClose() {
		this.setState({open: false});
	}

	async firebaseList(){
		// docs to show
		//debugger;
		let tacticsList = await fbList(this.props.perPage);

		// set for display
		this.setState({
			tactics: tacticsList
		});
	}

	loadTactics(e) {
		// read from "data-value" attribute
		const id = e.currentTarget.dataset.value;
		if (id) {
			this.handleClose();
			this.props.onLoad(id);
		}
	}

	renderThumbnail(t) {
		if (t) {
			return (<CardMedia component="img" height={177} image={t.thumbnail} alt={t.name} />);
		}
		return (<Skeleton variant="rectangular" height={177} />);
	}

	renderTitle(t) {
		let title = (<Skeleton />);
		let subheader = (<Skeleton />);
		if (t) {
			title = t.name;
			subheader = t.updated.toLocaleString();
		}
		return (
			<CardHeader
				sx={{
					padding: 1,
					display: "flex",
					overflow: "hidden",
					"& .MuiCardHeader-content": {
						overflow: "hidden"
					}
				}}
				titleTypographyProps={{ noWrap: true }}
				subheaderTypographyProps={{ noWrap: true }}
				title={title}
				subheader={subheader}
			/>
		);
	}

	renderDescription(t) {
		let created = (<Skeleton />);
		let description = (
			<React.Fragment>
				<Skeleton />
				<Skeleton />
				<Skeleton width="60%" />
			</React.Fragment>
		);
		if (t) {
			created = `created: ${t.created.toLocaleString()}`;
			description = t.description;
		}
		return (
			<CardContent sx={{ p:1, pt: 0.5, height: 71 }}>
				<Typography component="div" variant="caption" color="text.secondary">{created}</Typography>
				{description}
			</CardContent>
		);
	}

	renderItems() {
		return this.state.tactics.map((t, index) => {
			const val = t ? t.id : null;
			return (
				<Grid key={index} item xs={1}>
					<Card sx={{ width: 320, marginRight: 0.5, my: 1 }} data-value={val} onClick={this.loadTactics}>
						<CardActionArea>
							{this.renderTitle(t)}
							{this.renderThumbnail(t)}
							{this.renderDescription(t)}
						</CardActionArea>
					</Card>
				</Grid>
			);
		});
	}

	render() {
		return (
			<Dialog fullWidth={true} maxWidth="lg" open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Browse tactics</DialogTitleClose>
				<DialogContent dividers>
					<Grid container columns={3}>
						{this.renderItems()}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

BrowseDialog.defaultProps = {
	onLoad: null,
	perPage: 6
}

BrowseDialog.propTypes = {
	onLoad: PropTypes.func,
	perPage: PropTypes.number
}

export default BrowseDialog;