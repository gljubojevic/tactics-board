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
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';

class BrowseDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.loadTactics = this.loadTactics.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.menuOpen = this.menuOpen.bind(this);
		this.menuClose = this.menuClose.bind(this);
		this.state = {
			open: false,
			tactics: [null],
			loading: false,
			loadMore: false,
			menuOpen: false,
			menuAnchorEl: null,
			menuTacticsID: null
		}
	}

	Show() {
		// reset on first list show
		this.setState({
			open: true,
			tactics: [null],
			loading: true,
			loadMore: false,
			menuOpen: false,
			menuAnchorEl: null,
			menuTacticsID: null
		});
		this.List();
	}
	
	handleClose() {
		this.setState({open: false});
	}

	async List(){
		// docs to show
		let tactics = await this.props.onList(this.props.perPage, null);
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
		let tactics = await this.props.onList(this.props.perPage, afterDoc);
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

	menuOpen(e) {
		// read from "data-value" attribute
		const selectedValue = e.currentTarget.dataset.value;
		this.setState({
			menuOpen: true,
			menuAnchorEl: e.currentTarget,
			menuTacticsID: selectedValue
		});
	}

	async menuClose(e) {
		// read from "data-value" attribute
		const selectedValue = e.currentTarget.dataset.value;
		switch (selectedValue) {
			case "delete":
				await this.props.onDelete(this.state.menuTacticsID);
				this.List();
				break;
			default:
				break;
		}
		this.setState({
			menuOpen: false,
			menuAnchorEl: null,
			menuTacticsID: null
		});
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
		const val = t ? t.id : null;
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
				action={
					<IconButton aria-label="settings" data-value={val} onClick={this.menuOpen}>
						<MoreVertIcon />
					</IconButton>
				}
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
					<Card sx={{ width: 320, marginRight: 0.5, my: 1 }}>
						{this.renderTitle(t)}
						<CardActionArea data-value={val} onClick={this.loadTactics}>
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
				<Menu open={this.state.menuOpen} anchorEl={this.state.menuAnchorEl} onClose={this.menuClose}
					PaperProps={{
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
					<MenuItem data-value="delete" onClick={this.menuClose}>
						<ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>Delete
					</MenuItem>
				</Menu>
			</Dialog>
		);
	}
}

BrowseDialog.defaultProps = {
	onList: null,
	onLoad: null,
	onDelete: null,
	perPage: 6
}

BrowseDialog.propTypes = {
	onList: PropTypes.func,
	onLoad: PropTypes.func,
	onDelete: PropTypes.func,
	perPage: PropTypes.number
}

export default BrowseDialog;