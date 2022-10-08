import {
    Controller,
    Req,
    Res,
    Get,
    Post,
    UseFilters,
    UseGuards,
    Param,
    Body,
    HttpStatus,
    UseInterceptors, UploadedFile, HttpException, StreamableFile
} from "@nestjs/common";
import {HttpExceptionFilter} from "../auth/filters/http-exception.filter";
import {IntraJwtGuard} from "../auth/guards/intra_jwt.guard";
import {ProfileService} from "./profile.service";
import { username_dto } from "./dtos/username.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import e from "express";
import { createReadStream } from "fs";
import { TwofactorGuard } from "../twofactorauth/guards/twofactor.guard";
import {limits} from "argon2";

@UseFilters(HttpExceptionFilter)
// @UseGuards(IntraJwtGuard)
@UseGuards(TwofactorGuard)
@Controller("profile")
export class ProfileController {
    constructor(
      private profileService: ProfileService
    ) {}

    @Get("achievements/:id?")
    async getAchievements(@Req() req, @Res() res, @Param("id") id: string) {
        let achievements;
        if (id) {
            achievements = await this.profileService.get_Achievements(id);
        } else
            achievements = await this.profileService.get_Achievements(req.user);
        res.send(achievements);
    }


    @Get("match_history/:id?")
    async getMatch_history(@Req() req, @Res() res, @Param("id") id : string) {
        let matches;
        if (id)
            matches = await this.profileService.getMatch_history(id);
        else
            matches = await this.profileService.getMatch_history(req.user);
        res.send(matches);
    }

    @Get("infos/:id?")
    async getInfos(@Req() req, @Res() res, @Param("id") id: string) {
        let infos;
        if (id) {
            infos = await this.profileService.getInfos(id);
        }else {
            infos = await this.profileService.getInfos(req.user);
        }
        res.send(infos);
    }

    @Post("change_username")
    async change_username(@Req() req, @Res() res, @Body() username_dto: username_dto) {
        await this.profileService.change_username(req.user, username_dto.username);
        res.cookie("username", username_dto.username);
        res.status(HttpStatus.CREATED).json({"username": username_dto.username});
    }

    @Get("navbar")
    async getNavbar(@Req() req) {
        return await this.profileService.getNavbar(req.user);
    }
    // NEEDs protection
    @Post("avatar")
    @UseInterceptors(FileInterceptor("avatar", {
        storage: diskStorage({
            destination: (req, file, cb) => cb (null, "avatars/"),
            filename(req: any, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
                const ext = file.originalname.split(".");
                // console.log(ext[ext.length - 1]);
                callback(null, req.user + "." + ext[ext.length - 1]);
            }
        }),
        fileFilter(req: any, file: Express.Multer.File, callback: (error: (Error | null), acceptFile: boolean) => void) {
            const ext = file.mimetype.split("/")[1];
            if (ext === "jpeg" || ext === "png")
                callback(null, true);
            else
                callback(null, false);
        },
        // limits:{
        //     fileSize: 2e+6
        // }
    }))
    async upload_avatar(@Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
        if (!file)
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        const avatarUrl = await this.profileService.change_avatar(req.user, file);
        console.log("AvatarURL", avatarUrl);
        res.cookie("avatar", avatarUrl);
        res.status(HttpStatus.CREATED).json({"avatar": avatarUrl});
    }

    @Get("avatars/:image")
    async getAvatar(@Req() req, @Res() res, @Param("image") image: string)  {
        const file = await this.profileService.getAvatar(req.user, image);
        file.pipe(res)
        // return new StreamableFile(file).setErrorHandler(err => {
        //     if (err)
        //         console.log("Error", err);
        // });
    }

}
