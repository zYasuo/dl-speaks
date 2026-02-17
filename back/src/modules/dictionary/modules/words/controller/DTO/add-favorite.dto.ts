import { IsNumber, IsNotEmpty } from "class-validator";

export class AddFavoriteDTO {
    @IsNumber()
    @IsNotEmpty()
    wordId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}