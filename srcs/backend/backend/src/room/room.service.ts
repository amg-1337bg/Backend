import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2';
import { endWith } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { check_protected, createRoomDto, dm_room, dto_block, dto_block_user, dto_changePass, room_name } from './dto/create-room.dto';
import { StatusService } from "../status/status.service";
import { threadId } from 'worker_threads';

@Injectable()
export class RoomService {
   constructor(private prisma: PrismaService){}

	async create_post_room(createRoomDto: createRoomDto, current_user: string){
		let hash;
		if(createRoomDto.type === "public" || createRoomDto.type === "private")
			hash = ''; 
		else
			hash = await argon.hash(createRoomDto.password);
		const name = createRoomDto.name;
		const userCount = await this.prisma.user.count(
            {
                where: {
                    login: current_user
                }
            }
        )
		const identif = await this.prisma.room.count(
			{
				where: {
					name: createRoomDto.name,
					owner: current_user
				}
			}
		)
		if (userCount == 1 && identif == 0)
		{
			const newroom = {
				name: createRoomDto.name,
				type: createRoomDto.type,
				password: hash,
				owner: current_user,
				users_room : {
					create: {
						user_id : current_user,
						user_role: 'owner',
						state_user: '',
					}
				}
			}
			const new_user_room = await this.prisma.room.create({data: newroom});
			return (new_user_room);
		
		}
		else {
			return new HttpException('Error to add room', HttpStatus.FOUND);
		}
	}

	async get_rooms(current_user: string)
    {
        const getrooms = await this.prisma.users_room.findMany({ 
            where:
            {
                user_id: current_user,
				NOT:{
					state_user: {
						contains: 'kicked',
					}
				},
				room:{
					OR: [
						{
							type: 'public'
						},
						{
							type: 'protected'
						},
						{
							type: 'private'
						},
					]
				}
            },
            select:{
				id: true,
                user_role: true,
                room_id: true,
				state_user : true,
                room: {
                    select: {
                        type: true,
                    }
                },
            },
            orderBy: {
                user_role: 'asc',
            },
        })
        return (getrooms);
    }
	/**************************************************************** */

	async checkProtected(current_user: string, infos : check_protected)
	{
		const getPass = await this.prisma.room.findFirst({
			where : {
				name : infos.room_id,
			},
			select :{
				password : true,
			}
		})

		const ret = await this.prisma.users_room.findFirst({
			where :{
				room_id : infos.room_id,
				user_id : current_user,
			}
		});
		if(ret)
			return {"status" : true, "msg" : `you are already at room ${infos.room_id}`}
		if(!ret)
		{
			if(await argon.verify(getPass.password,infos.password))
			{
				await this.prisma.users_room.create({
				data :{
					user_id : current_user,
					room_id : infos.room_id,
					user_role : "user",
					state_user : "",
				}
				});
				return {"status" : true, "msg" : `you are now user  at room ${infos.room_id}`}
			}
		}
		return {"status" : false, "msg" : `incorrect password for  ${infos.room_id}`};
	}
	/***************************************************************************/
	/** get all public rooms except rooms where the user is kicked */

	async get_public_room(current_user: string)
	{
		let arr = [];
		const get_public_room = await this.prisma.users_room.findMany({
			where:{
				AND: [
					{state_user : "kicked"},
					{user_id : current_user}
				]
		
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr[i] = value[i].room_id; 
			}
		})
		const getinfo = await this.prisma.room.findMany({
			where: {
				type: 'public',
				name:{
					notIn: arr,
				}
			},
			select: {
				users_room:{
					select:
					{
						id: true,
						user_role: true,
						room_id: false,
						state_user: false,
					},
				},
				_count: {
					select:{
						users_room: true,
					}
				},
				id: true,
				name : true,
				owner: true,
				type : false,
				password : false,
			},
		})
		return (getinfo);
	}
/***************************************************************************/
	/** get all protected rooms except rooms where the user is kicked */
	async get_protected_room(current_user: string){

		let arr = [];
		const get_public_room = await this.prisma.users_room.findMany({
			where:{
				AND: [
					{state_user : "kicked"},
					{user_id : current_user}
				]
		
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr[i] = value[i].room_id; 
			}
		})
		const getinfo = await this.prisma.room.findMany({
			where: {
				type: 'protected',
				name:{
					notIn: arr,
				}
			},
			select: {
				users_room:{
					select:
					{
						id: true,
						user_role: true,
						room_id: false,
						state_user: false,
					},
				},
		
				_count: {
					select:{
						users_room: true,
					}
				},
				id: true,
				name : true,
				owner: true,
				type : false,
				password : false,
			},
		})
		return (getinfo);
	}
/***************************************************************************/

	/** get all messages of room for the user in conditon that is not banned or kicked + except messages of users blocked but that user  */
	async get_room_msgs(name: room_name, current_user: string)
	{
		//get state of user in that room 
		const state = await this.prisma.users_room.findFirst({
			where :{
				user_id : current_user,
				room_id : name.room_id,
				
				OR :[ 
				{ state_user : "banned"} ,
				{state_user : "kicked"}
			]
			}
		});
		if(state)
			return [];
		let arr = [];
		const friends = await this.prisma.friendship.findMany({
			where:{
				id_user_1: current_user,
				stat_block: true,
			},
			select:{
				id_user_2: true,
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr[i] = value[i].id_user_2; 
			}
		})

		const msgs = await this.prisma.messageRoom.findMany({
			where: { room_name: name.room_id, 
				from:{
					notIn: arr,
				}
			},
			select:
			{
				from: true,
				content_msg: true,
				avatar : true ,
				room_name: false,
				id: false,
				creationDate: false
			},
			orderBy:{
				creationDate: 'asc', 
			}
		});
		return (msgs);
	}
/***************************************************************************/


	async post_name_dm(name: dm_room, current_user: string){
		const msgs = await this.prisma.directMessage.findMany({
			where: { 
				OR: [
					{
						from: current_user, to: name.to,
					},
					{
						from: name.to, to: current_user
					},
				  ]
			},
			select:
			{
				from: true,
				to: true,
				content_msg: true,
				id: false,
				creationDate: false
			},
			orderBy:{
				creationDate: 'asc',
			}
			
		});
		return (msgs);
	}

	async getAllUsersOfRoom(infos : room_name, current_user: string)
	{ 
		let arr = [];
		const friends = await this.prisma.friendship.findMany({
			where:{
				id_user_1: current_user,// current 
				stat_block: true,
			},
			select:{
				id_user_2: true,
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr[i] = value[i].id_user_2; 
			}
		})
		let arr1 = [];
		const get_public_room = await this.prisma.users_room.findMany({
			where:{
				room_id: infos.room_id,
				state_user: 'kicked',
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr1[i] = value[i].user_id; 
			}
		})
	  	return await this.prisma.users_room.findMany({
			orderBy: {
				 user_role: 'asc',
			},
			where : {
				room_id :  infos.room_id,
				user_id :{
					notIn : arr.concat(arr1),
					not: current_user,
				}
			},
			select :{
				user_role : true,
				user : {
					select :{
					  id : true,
					  avatar : true,
					  login: true,
					  username: true,
					}
			  }
			},
			
		})    
  }

  async get_friends(current_user: string){
   const friends = await this.prisma.friendship.findMany({
	where:{
		stat_block: false,
		type: 'friend',
		id_user_1: current_user,
	},
	select:{
		id: true,
		user2:{
			select:{
				login: true,
				username: true,
				avatar: true,
			}
		}
	},
   })
   return (friends);
  }

	async instant_messaging(current_user: string)
	{
		const find = await this.prisma.room.findFirst({
		where:{
			name:{
					contains: current_user + '+',
				}
			},
		});
		if (find)
		{
			return await this.prisma.friendship.findMany({
				where:{
					id_user_1: current_user,
					stat_block: false,
					check_im: true,
				},
				select:{
					type: true,
					user2:{
						select:{
							id: true,
							login: true,
							username: true,
							avatar: true,
						}
					}
				},
				orderBy:{
					id_user_2: 'asc'
				}
			})
		}
		else
			return([])
	}
	
	async chat_with_user(current_user: string , to: string)
	{
		const dm_name = await this.prisma.room.findFirst({
            where:{
                OR: [
                    {
                    name: current_user + '+' + to + '+',
                    },
                    {
                    name: to + '+' + current_user + '+',
                    },
                ]
            }
        });
		const check = await this.prisma.friendship.findFirst({
			where :{
					id_user_1 : current_user,//current
					id_user_2 : to,
					// stat_block: false,
			}
		});
		const check2 = await this.prisma.friendship.findFirst({
			where :{
					id_user_1 : to,//current
					id_user_2 : current_user,
					// stat_block: false,
			}
		});
		if (!dm_name && !check && !check2){
			await this.prisma.room.create({
			  data: {
				name: current_user + '+' + to + '+', type: 'dm', password: '', owner: to,
			  } 
			});
			await this.prisma.friendship.create({
				data:{
					id_user_1 : current_user,
					id_user_2 : to,
					stat_block : false,
					type : "user",
					check_im: true,
				}
			});
			await this.prisma.friendship.create({
				data:{
					id_user_1 : to,
					id_user_2 : current_user,
					stat_block : false,
					type : "user",
					check_im: true,
				}
			});
			return (true);
		}
		if (check.stat_block === false)
		{
			if (!dm_name)
			{
				await this.prisma.room.create({
					data: {
					name: current_user + '+' + to + '+', type: 'dm', password: '', owner: to,
					} 
				});
			}  
			await this.prisma.friendship.update({
				where:{
					id: check.id,
				},
				data:{
					check_im: true,
				}
			});
		}
		if (check2.stat_block === false)
		{
			await this.prisma.friendship.update({
				where:{
					id: check2.id,
				},
				data:{
					check_im: true,
				}
			});
		}
		else if (check.stat_block === true)
		{
			return(false);
		}
	}

	async block_user(current_user: string, infos: dto_block_user)
	{
		const dm_name = await this.prisma.room.findFirst({
            where:{
                OR: [
                    {
                    name: current_user + '+' + infos.user_to_block + '+',
                    },
                    {
                    name: infos.user_to_block + '+' + current_user + '+',
                    },
                ]
            }
        });
		if (dm_name)
		{
			await this.prisma.room.delete({
				where:{
					id: dm_name.id,
				}
			})
		}
		const check = await this.prisma.friendship.findFirst({
			where :{
			id_user_1 : current_user,//current
			id_user_2 : infos.user_to_block
			}
		});
		const check2 = await this.prisma.friendship.findFirst({
			where :{
			id_user_1 : infos.user_to_block,//current
			id_user_2 : current_user
			}
		});
		if(!check)
		{
			await this.prisma.friendship.create({
				data : {
					id_user_1 : current_user ,
					id_user_2 : infos.user_to_block,
					stat_block : true,
					type : "user"
				}
			});
		}
		if (!check2)
		{
			await this.prisma.friendship.create({
				data : {
					id_user_1 : infos.user_to_block,
					id_user_2 : current_user,
					stat_block : true,
					type : "user"
				}
			});
			return (true);
		}
		if (check && check2){
			await this.prisma.friendship.update({
				where:{
					id : check.id,
				},
				data : {
					stat_block : true
				}
			});
			await this.prisma.friendship.update({
				where:{
					id : check2.id,
				},
				data : {
					stat_block : true
				}
			});
			return (true);
		}
	}

	async getNumberNotKicked(room : string)
	{
		const ret = await this.prisma.users_room.aggregate({
			where :{
				room_id : room,
				NOT : {
					state_user : "kicked"
				}
			},
			_count : {
				state_user : true,
			}
		
		});

		return ret;
		

	}

	async joinroom(current_user : string , infos : room_name)
	{
		
		const ret = await this.prisma.users_room.findFirst({
			where :{
				room_id : infos.room_id,
				user_id : current_user,
			}
		});
		if(!ret)
		{
		
			return  await this.prisma.users_room.create({
				data :{
					user_id : current_user,
					room_id : infos.room_id,
					user_role : "user",
					state_user : "",

				}
			})
		}
		return { room_id : ""}
		
	}


}
