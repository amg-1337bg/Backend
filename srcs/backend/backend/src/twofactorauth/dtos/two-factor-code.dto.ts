import { IsNumber, IsString } from "class-validator";

export class TwoFactorCodeDto {
  @IsString()
  tfacode: string
}