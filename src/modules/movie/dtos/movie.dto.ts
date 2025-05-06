import { IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MovieDto {
    @ApiProperty({
        example: 'f12a7f90-b60e-4891-91a2-d92fa70eeabc',
        description: 'Identificador único do filme'
    })
    @IsUUID()
    id: string

    @ApiProperty({
        example: 'Interstellar',
        description: 'Título do filme'
    })
    @IsString()
    title: string

    @ApiProperty({
        example: 'tt0816692',
        description: 'ID da API externa (por exemplo, IMDB)'
    })
    @IsString()
    apiId: string

    @ApiProperty({
        example: 'https://image.tmdb.org/t/p/w500/interstellar.jpg',
        description: 'URL da imagem do filme'
    })
    @IsString()
    imageUrl: string

    @ApiPropertyOptional({
        example: 'f8cb4a7b-17a5-4706-89ff-6a7ff8c5577a',
        description: 'ID do favorito (caso o filme esteja favoritado por um usuário)'
    })
    @IsString()
    @IsOptional()
    favoriteId?: string
}
