
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from "./store";

import { NavBarNew } from './components/NavBarNew';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { initUser } from './store/userReducer';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { disconnectSocketGlobal, initSocketGlobal } from './store/socketGlobalReducer';
import Main from './components/Main';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},

	typography: {
		fontFamily: [
			"Lexend",
			"sans-serif"
		].join(",")
	},
});

const Home = React.lazy(() => import('./components/Home'));
const DashboardUser = React.lazy(() => import('./components/Profile/DashboardUser'));
const ChatRoom = React.lazy(() => import('./components/GlobalRooms'));
const InstantMessaging = React.lazy(() => import('./components/GlobalDM'));
const Matchmaking = React.lazy(() => import('./components/Game'));
const LiveMatchs = React.lazy(() => import('./components/LiveMatchs'));
const Login = React.lazy(() => import('./components/LoginPage'));
const SignUp = React.lazy(() => import('./components/SignUp'));
const SignInTFA = React.lazy(() => import('./components/SignInTFA'));
const Loading = () => <Box margin="auto"><CircularProgress /><p>Loading ...</p></Box>;


function App() {
	const dispatch = useDispatch();
	const logged_user = useSelector((state: RootState) => state.user).login;
	const [cookies, setCookie, removeCookie] = useCookies();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (cookies.Authorization) {
			dispatch(initUser({ login: cookies.login, username: cookies.username, avatar: cookies.avatar }));
			dispatch(initSocketGlobal({ host: (process.env.REACT_APP_SERVER_IP as string) + "/global", user: cookies.login }));
			console.log("User token: " + cookies.Authorization);
			if (location.pathname === '/' || location.pathname === '/tfa' || location.pathname === '/signUp')
				navigate("/home");
		}
		return (() => {
			dispatch(disconnectSocketGlobal());
		})
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<ToastContainer position="top-right" newestOnTop autoClose={1500} />
			<CssBaseline />
			<Main/>
			<Stack direction="row" width="100%" height="100%"
				sx={{ backgroundColor: "#202541" }}>
				<React.Suspense fallback={<Loading />}>
					{(logged_user !== '' && location.pathname !== '/' && location.pathname !== '/signUp'
						&& location.pathname !== '/tfa') && <NavBarNew />} 
					<Routes>
						<Route path='/' element={<Login />} />
						<Route path='/signUp' element={<SignUp />} />
						<Route path='/tfa' element={<SignInTFA />} />
						<Route path='/home' element={<Home />} />
						<Route path='/dashboard' element={<DashboardUser />} />
						<Route path='/chatRoom' element={<ChatRoom />} />
						<Route path='/instantMessaging' element={<InstantMessaging />} />
						<Route path='/matchmaking' element={<Matchmaking />} />
						<Route path='/liveMatchs' element={<LiveMatchs />} />
					</Routes>
				</React.Suspense>
			</Stack>

		</ThemeProvider >
	);
}

export default App;  