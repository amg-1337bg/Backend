import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStatsInfo, UserStatsData } from '../../requests/dashboard'
import AvatarProfile from './Elements/AvatarProfile'
import StatElementBar from './Elements/StatElementBar'
import StatSegment from './Elements/StatSegment'
import UserNameElement from './Elements/UserNameElement'

let initUserStats: UserStatsData = {} as UserStatsData;

const UserStats = ({ other_user }: { other_user?: string }) => {
	const [user_stats, setUserStats] = useState(initUserStats);
	const navigate = useNavigate();
	
	useEffect(() => {
		getStatsInfo(other_user).then((value) => {
			if ((typeof value) === (typeof initUserStats)) {
				const data = value as UserStatsData;
				console.log("DATA", data);
				setUserStats(data);
			}
		}).catch((error: any) => {
			console.log("Error ;Not Authorized", error);
			navigate(error.redirectTo);
		})
		return (() => {
			setUserStats(initUserStats);
		})
	}, []);

	
	return (
		<Stack alignItems="flex-start" spacing={10} paddingTop="25px"
			sx={{ backgroundColor: "#3F4478", width: "380px", height: "850px", borderRadius: "30px" }}>
			{/* ****************** User Head **************** */}
			<Stack direction="row" alignItems="flex-start" spacing={0.5} paddingLeft="6%">
				<AvatarProfile avatar={user_stats?.avatar} />
				<Stack alignItems="flex-start" spacing={1}>
					<Box sx={{ marginLeft: "13px", marginTop: "5px" }}>
						<UserNameElement login={user_stats?.login} username={user_stats?.username} level={user_stats?.level} avatar={user_stats.avatar} />
					</Box>
					<StatElementBar total_matches={user_stats?.total_matches} friends={user_stats?.friends} ratio={user_stats?.ratio} />
				</Stack>
			</Stack>
			{/* ****************** User Stats **************** */}
			<Box paddingLeft="8%">
				{/* <Box>
					<div className="global-score" style={{ color: "#A9AEE3" }} >Global Score </div>
					<div className="global-score"  >268</div>
				</Box> */}
				<Stack direction="row" spacing={5} marginTop="10%">
					<StatSegment name={'Wins'} value={user_stats?.wins} />
					<StatSegment name={'Loses'} value={user_stats?.loses} />
				</Stack>
				<Stack direction="row" spacing={5} marginTop="10%">
					<StatSegment name={'Goals'} value={user_stats?.goals} />
					<StatSegment name={'InGoals'} value={user_stats?.in_goals} />
				</Stack>
			</Box>
		</Stack>
	)
}

export default UserStats