import { useEffect, useRef, useState } from "react";
import './Game/canvas.css'
import { io, Socket } from "socket.io-client";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import './Game/navGame.css'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

type Cmds = {
	room: string;
	key_up: boolean;
	key_down: boolean;
}

export type Player = {
	login?: string;
	username?: string;
	avatar?: string;
	id: string,
	x: number;
	y: number;
	w: number;
	h: number;
	score: number;
	scorpos: number;
	cmds?: Cmds;
	room?: string;
}

type Ball = {
	x: number;
	y: number;
	r: number;
	speed: number;
	velX: number;
	velY: number;
}

let socket: Socket;
let width = (window.innerWidth) * 0.75;
let g = false;
// let width = document.getElementById('game-container')?.clientWidth as number;
let height = width / 2;
let cof: number;
let room: string = '';
// let players:any = {};
let P1 = {} as Player;	// = {id: '', x: 0, y: 0, w: 0, h:0, score: 0, scorpos: 0};
let P2 = {} as Player;	// = {id: '', x: 0, y: 0, w: 0, h:0, score: 0, scorpos: 0};



let ball: Ball = {
	x: 0,
	y: 0,
	r: 0,
	speed: 0,
	velX: 0,
	velY: 0,
}

let player_cmd: Cmds = { room: room, key_up: false, key_down: false };
let gameover: boolean = false;


let drawRect = (ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	c: string)
	: void => {
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
}

// let drawScore = (ctx: CanvasRenderingContext2D,
// 	score: number,
// 	x: number,
// 	y: number,
// 	color: string)
// 	: void => {
// 	ctx.fillStyle = color;
// 	let font_size = window.innerWidth / 15;
// 	ctx.font = font_size + 'px oxygen';
// 	ctx.fillText(`${score}`, x, y);
// }

let drawGameOver = (ctx: CanvasRenderingContext2D) => {
	if (gameover) {
		let font_size = window.innerWidth / 15;
		ctx.font = font_size + 'px oxygen';
		ctx.fillText('GAME OVER', width / 2 - font_size * 3, height / 2 + font_size / 4);
	}
}

let drawBall = (ctx: CanvasRenderingContext2D,
	ball: Ball)
	: void => {
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

let drawNet = (ctx: CanvasRenderingContext2D): void => {
	for (let i: number = ctx.canvas.height / 35; i < ctx.canvas.height; i += ctx.canvas.height / 8) {
		drawRect(ctx, (ctx.canvas.width / 2) - (ctx.canvas.width / 400), i, ctx.canvas.width / 200, ctx.canvas.height / 15, "#cbcbcb");
	}
}

let drawGame = (ctx: CanvasRenderingContext2D): void => {
	ctx!.canvas.width = width;
	ctx!.canvas.height = height;
	drawRect(ctx, 0, 0, width, height, "black");
	if (P1.x !== 0) {
		drawRect(ctx, P1.x * cof, P1.y * cof, P1.w * cof, P1.h * cof, 'white');
		// drawScore(ctx, P1.score, (P1.scorpos * (width / 4) - (width / 30)), height / 4, "#cbcbcb");
		// let p : keyof typeof players;
		// for (p in players)
		// {
		// 	drawRect(ctx, players[p].x * cof, players[p].y * cof, players[p].w * cof, players[p].h * cof, 'white');
		// 	drawScore(ctx, players[p].score, (players[p].scorpos * (width / 4) - (width / 30)), height / 4, "#cbcbcb");
		// }
	}
	if (P2.x !== 0) {
		drawRect(ctx, P2.x * cof, P2.y * cof, P2.w * cof, P2.h * cof, 'white');
		// drawScore(ctx, P2.score, (P2.scorpos * (width / 4) - (width / 30)), height / 4, "#cbcbcb");
	}
	drawNet(ctx);
	if (gameover)
		drawGameOver(ctx);
	if (!gameover)
		drawBall(ctx, ball);
}

let fadeOut = (ctx: CanvasRenderingContext2D, text: string) => {
	let alpha = 1.0,   // full opacity
		interval = setInterval(function () {
			drawGame(ctx);
			ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
			let font_size = width / 7;
			ctx.font = font_size + 'px oxygen';
			ctx.fillText(text, (width / 2) - (width / 30), height / 2 + height / 14);
			alpha = alpha - 0.05; // decrease opacity (fade out)
			if (alpha < 0) {
				clearInterval(interval);
			}
		}, 50);
}

let countdown = (ctx: CanvasRenderingContext2D) => {
	fadeOut(ctx, '3');
	drawGame(ctx);
	setTimeout(() => {
		fadeOut(ctx, '2');
		drawGame(ctx);
	}, 1000);
	setTimeout(() => {
		fadeOut(ctx, '1');
		drawGame(ctx);
		gameover = false;
	}, 2000);
}

let emit_cmds = (player_cmd: Cmds, gameover: boolean) => {
	let p_c = player_cmd;
	p_c.room = room;
	// console.log(room);
	if (!gameover)
		socket.emit('usr_cmd', p_c);
}

let commands = (canvas: HTMLCanvasElement, player_cmd: Cmds) => {
	let keypressed = false;
	window!.addEventListener('keydown', function (event) {
		if (event.keyCode === 38) {
			keypressed = true;
			player_cmd.key_up = true;
		}
		if (event.keyCode === 40) {
			keypressed = true;
			player_cmd.key_down = true;
		}
		if (keypressed === true) {
			emit_cmds(player_cmd, gameover);
			keypressed = false;
		}
	}, false);
	window!.addEventListener('keyup', function (event) {
		if (event.keyCode === 38) {
			if (player_cmd.key_up === true) { keypressed = true; }
			player_cmd.key_up = false
		}
		if (event.keyCode === 40) {
			if (player_cmd.key_down === true) { keypressed = true; }
			player_cmd.key_down = false;
		}
		if (keypressed === true) {
			emit_cmds(player_cmd, gameover);
			keypressed = false;
		}
	}, false);
}

let updateBalldisplay = (ball: Ball): void => {
	ball.x *= cof;
	ball.y *= cof;
	ball.r *= cof;
	ball.speed *= cof;
	ball.velX *= cof;
	ball.velY *= cof;
}

const Canvas = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	// const match_info = useSelector((state: RootState) => state.game);
	const player_info = useSelector((state: RootState) => state.user);
	let mode: string = searchParams.get('mode') as string;
	if (!mode) mode = "";

	let invite = searchParams.get('key') as string;
	if (!invite) invite = '';
	// const invite = ''
	let watching = searchParams.get('room') as string;
	if (!watching) watching = '';

	if (!g) {
		g = true;
		socket = io(process.env.REACT_APP_SERVER_IP as string + '/game', { auth: { mode: mode, info: player_info, invite: invite, room: watching } });
	}

	socket!.emit('size_change', width);

	const canvasRef = useRef<HTMLCanvasElement>(null)


	const [player1, setPlayer1] = useState(P1);
	const [player2, setPlayer2] = useState(P2);

	const [score1, setScore1] = useState(P1.score);
	const [score2, setScore2] = useState(P2.score);

	useEffect(() => {
		const canvas = canvasRef!.current;
		const ctx = canvas!.getContext('2d');
		if (!ctx)
			return;
		ctx.font = 'oxygen';

		socket.on('update', (size, c) => {
			width = size;
			height = width / 2;
			cof = c;
			drawGame(ctx);
		})

		socket.on('start_game', () => {
			countdown(ctx);
			if (mode !== '3')
			commands(canvas!, player_cmd);
		})
		
		socket.on('game_over', () => {
			gameover = true;
			room = '';
			drawGame(ctx);
		})

		socket.on('update_connections', (p1: Player, p2: Player, b: Ball) => {
			if (player1.login !== p1.login)
				setPlayer1(p1);
			if (player2.login !== p2.login)
				setPlayer2(p2);
			
			if (P1.score !== p1.score)
				setScore1(p1.score);
			if (P2.score !== p2.score)
				setScore2(p2.score);
			P1 = p1;
			P2 = p2;
			if (room === '')
				room = P1.room!;
			ball = b;
			updateBalldisplay(ball);
			drawGame(ctx);
		})

		function handleResize() {
			const canvas = canvasRef!.current;
			const ctx = canvas!.getContext('2d');

			// let new_width = document.getElementById('game-container')?.clientWidth as number;
			let new_width = (window.innerWidth) * 0.75;
			socket.emit('size_change', new_width);
			socket.on('update', (size, c) => {
				width = size;
				height = width / 2;
				cof = c;
				drawGame(ctx!);
			})
		}



		window.addEventListener('resize', handleResize)
		return () => {
			socket.off('size_change');
			socket.off('update_connections');
			window.removeEventListener('resize', handleResize)
		}
	});

	useEffect(() => {
		return (() => {
			socket.emit('disconnectMe');
			console.log("Canva Unmounted");
			let width = (window.innerWidth) * 0.75;
			g = false;
			height = width / 2;
			cof = 1;
			room = '';
			P1 = {} as Player;
			P2 = {} as Player;
			gameover = false;

		})
	}, [])
	return (
		<div>
			<div className="game-bar">
				<div className="user-side">
					<div className="user-info">
						<div className="user-img">
							<img alt={player1.username} src={player1.avatar} style={{ width: "auto" }} />
						</div>
						<p>{player1.username}</p>
					</div>

				</div><div className="users-score"><p><span>{score1}</span> : <span>{score2}</span></p></div><div className="user-side">
					<div className="user-info">
						<div className="user-img"><img alt={player2.username} src={player2.avatar} style={{ width: "auto" }} /></div>
						<p>{player2.username} </p>
					</div>

				</div>
			</div>
			<canvas id='game' ref={canvasRef} />
			<Box className="exit-button" onClick={() => {navigate('/home')}}>
				<Typography fontWeight="800">LEAVE MATCH</Typography> 
				</Box>
		</div>)
};

export default Canvas;