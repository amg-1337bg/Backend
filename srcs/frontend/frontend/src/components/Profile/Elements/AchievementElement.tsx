import { Avatar, Box, Grow } from '@mui/material'
import React from 'react';
import { useDispatch } from 'react-redux';
import achivJoystickIcon from '../../../assets/Achievements/achiev1-joystick.png';
import achivSwordIcon from '../../../assets/Achievements/Achiev2-sword.png';
import achivSpeedkIcon from '../../../assets/Achievements/Achiev3-speed.png';
import achivmMndkIcon from '../../../assets/Achievements/Achiev4-mind-control.png';
import achivFriendlyIcon from '../../../assets/Achievements/Achiev5-friendly.png';
import achivTrophyIcon from '../../../assets/Achievements/Achiev6-trophy.png';
import { Achievement } from '../../../requests/dashboard';
import { setAchievement } from '../../../store/profileReducer';


const AchievementElement = (Props: Achievement) => {
	const dispatch = useDispatch();
	const bg_achv: string = !Props.achieved ? "#525784" : "#6659FF";
	const [checked, setChecked] = React.useState(true);

	let icon;
	switch (Props.achieve_id) {
		case 1: icon = achivJoystickIcon; break;
		case 2: icon = achivSwordIcon; break;
		case 3: icon = achivSpeedkIcon; break;
		case 4: icon = achivmMndkIcon; break;
		case 5: icon = achivFriendlyIcon; break;
		case 6: icon = achivTrophyIcon; break;
		default: icon = achivJoystickIcon; break;
	}

	const handleMouseOut = () => {
		dispatch(setAchievement(""));
		// setChecked((prev) => !prev);

	}

	const handleMouseOver = () => {
		dispatch(setAchievement(Props.achieve_name + ", " + Props.description))
		// setChecked((prev) => !prev)
	}

	return (
		<Grow
			in={checked}
			style={{ transformOrigin: '0 0 0' }}
			{...(checked ? { timeout: 1000 } : {})}
		>
			<Box
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}>
				<Avatar
					variant="square"
					sx={{
						height: '110px',
						width: '110px',
						backgroundColor: bg_achv,
						padding: "18px",
						borderRadius: "18px",
						"&:hover": {
							transform: "scale(1.2)",
							border: '4px solid #9CA0B5',
							borderRadius: '19px',
						}
					}}
					alt="Speed Achievement" src={icon} imgProps={{ style: { width: 'auto' } }} />
			</Box >
		</Grow>
	)
}

export default AchievementElement