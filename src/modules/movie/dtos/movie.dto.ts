import { IsString, IsOptional, IsUUID } from 'class-validator';

export class MovieDto {
    @IsUUID()
    id: string;

    @IsString()
    title: string;

    @IsString()
    apiId: string;

    @IsString()
    imageUrl: string;

    @IsString()
    @IsOptional()
    favoriteId?: string;
}