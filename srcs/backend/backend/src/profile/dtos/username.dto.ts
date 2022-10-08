import { IsString } from "class-validator";

export class username_dto {
  @IsString()
  public username: string
}