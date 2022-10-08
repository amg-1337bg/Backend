import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import { Badge,IconButton } from '@mui/material';
import { InvitationFriend } from './InvitationFriend&Game/InvitationFriend';
import { getInvitations, InvitationData } from '../requests/home';
import { useNavigate } from 'react-router-dom';

const initInvitationData: InvitationData[] = [] as InvitationData[];

export const InvitationsMenu = (Props: { count_invit: number }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [invitations, setInvitations] = React.useState(initInvitationData);
	const navigate = useNavigate();
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	React.useEffect(() => {
		getInvitations().then((value) => {
			if (typeof (value) === typeof (initInvitationData)) {
				const data = value as InvitationData[];
				setInvitations(data);
			}
		}).catch((error: any) => {
			console.log("Error ;Not Authorized", error);
			navigate(error.redirectTo);
		})
	}, [])

	return (
		<Box>
			<Badge badgeContent={Props.count_invit} color="secondary">
				<IconButton sx={{ width: "20px", height: "20px" }}
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}>
					<NotificationsIcon />
				</IconButton>
			</Badge>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				sx={{
					"& .MuiPaper-root": {
						backgroundColor: "#3D4060"
					}
				}}
			>
				<Box sx={{ maxWidth: 380 }}>
					{/* <nav aria-label="main folders"> */}
					<List >
						{invitations && invitations.map((item) => (
							<ListItem >
								<InvitationFriend login={item.login} username={item.username} avatar={item.avatar} />
							</ListItem>
						))}
						{invitations.length === 0 &&
							<ListItem >
								No request friend found
							</ListItem>}
					</List>
					{/* </nav> */}
					<Divider />
				</Box>
			</Menu>
		</Box>
	);
}