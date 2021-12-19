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
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { fbList } from '../firebaseSDK';

class BrowseDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.loadTactics = this.loadTactics.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.state = {
			open: false,
			tactics: [null],
			loading: false,
			loadMore: false
		}
	}

	Show() {
		// reset on first list show
		this.setState({
			open: true,
			tactics: [null],
			loading: true,
			loadMore: false
		});
		this.firebaseList();
	}
	
	handleClose() {
		this.setState({open: false});
	}

	async firebaseList(){
		// docs to show
		let tactics = await fbList(this.props.perPage, null);
		// set for display
		this.setState({
			tactics: tactics,
			loading: false,
			loadMore: tactics.length === this.props.perPage
		});
	}

	async nextPage() {
		//console.log("Next page...");
		this.setState({loading: true});

		// last doc reference
		const afterDoc = this.state.tactics[this.state.tactics.length - 1].docRef;
		// docs to show
		let tactics = await fbList(this.props.perPage, afterDoc);
		if (0 === tactics.length) {
			this.setState({
				loading: false,
				loadMore: false
			});
			return;
		}
		// set for display
		const loadMore = tactics.length === this.props.perPage;
		this.setState({
			tactics: this.state.tactics.concat(tactics),
			loading: false,
			loadMore: loadMore
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
						{this.renderTitle(t)}
						<CardActionArea>
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
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Browse my tactics - click on tactic to open in editor</DialogTitleClose>
				<DialogContent dividers>
					<Grid container columns={3}>
						{this.renderItems()}
					</Grid>
					<Stack direction="row" justifyContent="center">
						<LoadingButton
							onClick={this.nextPage}
							loading={this.state.loading}
							disabled={!this.state.loadMore}
							loadingPosition="start"
							startIcon={<CloudDownloadIcon />}
							variant="contained">More</LoadingButton>
					</Stack>
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