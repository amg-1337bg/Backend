import { Stack, Typography } from '@mui/material'
import RoomButton from './RoomButton'
import reloadIcon from '../assets/reload-icon.png'
import { getRoomsData, RoomData } from '../requests/home';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';



function createRooms(rooms_info: Array<RoomData>, kind: string): JSX.Element[] {
	const rooms = Array.from({ length: rooms_info.length }, (_, index) => {
		return (
			<li key={index++} className="item">
				<RoomButton room_id={rooms_info[index].room_id}
					owner={rooms_info[index].owner}
					count={rooms_info[index].count}
					kind={kind} />
			</li>
		);
	});
	return rooms;
}

interface VisibilityProps {
	kind: string
}

const initRooms: RoomData[] = [] as RoomData[];

const PublicRooms = ({ kind }: VisibilityProps) => {
	const currentPage = useSelector((state: RootState) => state.interfaces).current;
	const isFetch = useSelector((state: RootState) => state.fetch).roomsHome;
	const navigate = useNavigate();
	const [rooms, setRooms] = useState(initRooms);

	useEffect(() => {
		getRoomsData(kind).then((value) => {
			const data = value as Array<RoomData>;
			if ((typeof data) === (typeof initRooms))
				setRooms(data);
		}).catch((error: any) => {
			console.log("Error ;Not Authorized", error);
			navigate(error.redirectTo);
		})

		return () => {
			setRooms(initRooms);
		}
	}, [currentPage, isFetch]);

	return (
		<Stack
			spacing={2}
			sx={{ width: '100%', }}>
			<Stack
				spacing={2}
				direction='row'>
				<Typography
					sx={{
						fontWeight: 'bold',
						fontSize: '2rem',
						lineHeight: ' 35.05px',
						align: 'center',
					}}>
					{kind}</Typography>
				<img className='spin animated' alt='reload Icon' src={reloadIcon} style={{ width: 35 }} />
			</Stack>
			<div className="horizontal_slider">
				<div className="slider_container">
					{rooms && createRooms(rooms, kind)}
					{!rooms.length &&
						<Typography
							sx={{
								width: '100%',
								whiteSpace: "nowrap",
								color: '#ADADAD',
								fontWeight: '400',
								fontSize: '1rem',
								paddingTop: '1.2px',
							}}>No rooms exist at the moment! you can be the first to create your own.</Typography>
					}
				</div>
			</div>
		</Stack>
	)
}

export default PublicRooms