import { Body, Controller, Req, Post, UseFilters, UseGuards, UseInterceptors, Get} from '@nestjs/common';
import { check_protected, createRoomDto, dm_room, dm_to, dto_block_user, room_name } from './dto/create-room.dto';
import { GetRoomsInterceptor } from './interceptors/get_rooms.interceptor';
import { DataRoomInterceptor } from './interceptors/data_room.interceptor';
import { RoomService } from './room.service';
import { TransformInterceptor } from './interceptors/get_users_room.interceptor';
import { IntraJwtGuard } from 'src/auth/guards/intra_jwt.guard';
import { HttpExceptionFilter } from 'src/auth/filters/http-exception.filter';
import { FriendsUser } from './interceptors/friends_user.interceptor';
import { InstantMsg } from './interceptors/instant_msg.interceptor';
import { msgInterceptor } from './interceptors/msg.interceptor';
import { TwofactorGuard } from "../twofactorauth/guards/twofactor.guard";
import { DmService } from './dm/dm.service';
import { clickRoom } from './interceptors/click_room.interceptor';

// @UseGuards(IntraJwtGuard)
@UseGuards(TwofactorGuard)
@UseFilters(HttpExceptionFilter)
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService, private dm_service : DmService){}

    @Post('/postroom')
    post_room(@Req() req, @Body() createroomdto: createRoomDto){
        return this.roomService.create_post_room(createroomdto, req.user);
    }

    @UseInterceptors(GetRoomsInterceptor)
    @Get('/All_rooms_of_user')
    get_rooms(@Req() req)
    {
        return this.roomService.get_rooms(req.user);
    }

    /* get publci rooms , where the user  not joined(database) */
    @UseInterceptors(DataRoomInterceptor)
    @Get('/public_room')
    async get_public_room(@Req() req){
        return await this.roomService.get_public_room(req.user);
    }

    /* get public rooms , where the user  not joined(database) */
    @UseInterceptors(DataRoomInterceptor)
    @Get('/protected_room')
    get_protected_room(@Req() req){
        return this.roomService.get_protected_room(req.user);
    }

    @Post('/get_room_msgs')
    @UseInterceptors(msgInterceptor)
    post_name_room(@Req() req, @Body() room_id: room_name){
        return this.roomService.get_room_msgs(room_id, req.user);
    }

    @Post('/post_name_room_dm')
    @UseInterceptors(msgInterceptor)
    post_name_room_dm(@Req() req, @Body() name: dm_room){
        return this.roomService.post_name_dm(name, req.user);
    }

    @Post('/usersRoom')
    @UseInterceptors(TransformInterceptor)
    async getAllUsersOfRoom(@Req() req, @Body() infos : room_name)
    {
        return await this.roomService.getAllUsersOfRoom(infos, req.user);
    }

    @UseInterceptors(FriendsUser)
    @Get('/get_friends')
    async get_friends(@Req() req)
    {
        return await this.roomService.get_friends(req.user);
    }

    // @Post('/block_user')
    // block_user(@Req() req, @Body() infos: dto_block)
    // {
    //     return this.roomService.block_user(infos, req.user);
    // }

    @UseInterceptors(InstantMsg)
    @Get('/instant_messaging')
    async instant_messaging(@Req() req)
    {
        return await this.roomService.instant_messaging(req.user);
    }

    @Post('/chat_with_user')
    async chat_with_user(@Req() req, @Body() to: dm_room)
    {
        return await this.roomService.chat_with_user(req.user, to.to);
    }

    @Post('/block_user')
    async block_user(@Req() req, @Body() infos: dto_block_user)
    {
        return await this.roomService.block_user(req.user, infos);
    }

    @UseInterceptors(clickRoom)
    @Post('/clickroom')
    async joinroom(@Req() req, @Body() infos: room_name)
    {
        return await this.roomService.joinroom(req.user, infos);
    }

    @Post('/checkprotected')
    async checkProtected(@Req() req, @Body() infos: check_protected)
    {
        return await this.roomService.checkProtected(req.user, infos);
    }

  
}