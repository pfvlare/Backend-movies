import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { CardService } from './card.service'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody
} from '@nestjs/swagger'
import { CardDto } from './dtos/card.dto'

@ApiTags('cards')
@Controller('cards')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo cartão para um usuário' })
    @ApiResponse({ status: 201, description: 'Cartão criado com sucesso' })
    @ApiBody({ type: CardDto })
    create(@Body() createCardDto: CardDto) {
        return this.cardService.create(createCardDto)
    }

    @Post(':userId')
    @ApiOperation({ summary: 'Editar um cartão pelo id do usuário' })
    @ApiResponse({ status: 201, description: 'Cartão editado com sucesso' })
    @ApiBody({ type: CardDto })
    edit(@Param('userId') userId: string, @Body() editCardDto: CardDto) {
        return this.cardService.edit(userId, editCardDto)
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os cartões' })
    @ApiResponse({ status: 200, description: 'Cartões retornados com sucesso' })
    findAll() {
        return this.cardService.findAll()
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Busca cartão pelo ID do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Cartão retornado com sucesso' })
    findByUserId(@Param('userId') userId: string) {
        return this.cardService.findByUserId(userId)
    }

    @Delete(':userId')
    @ApiOperation({ summary: 'Deleta o cartão de um usuário pelo userId' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Cartão deletado com sucesso' })
    deleteByUserId(@Param('userId') userId: string) {
        return this.cardService.deleteByUserId(userId)
    }
}
