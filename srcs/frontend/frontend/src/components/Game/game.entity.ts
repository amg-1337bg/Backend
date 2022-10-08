import { BooleanLiteral } from "typescript";

export type	Player = {
	login?	: string;
	username?: string;
	avatar?	: string;
	id		: string,
	x		: number;
	y		: number;
	w		: number;
	h		: number;
	score	: number;
	scorpos	: number;
	room	:string;
	bailed?	:boolean;
}

export type	Ball = {
	x		: number;
	y		: number;
	r		: number;
	speed	: number;
	velX	: number;
	velY	: number;
}

export type Game = {
	mode	: string;
	P1		: Player;
	P2		: Player;
	ball	: Ball;
	started	: boolean;
	pause	: boolean;
	interupted : BooleanLiteral;
}
