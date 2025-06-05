import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CardService } from './card.service';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { CreateCardDto, UpdateCardDto } from './dtos/card.dto';

@ApiTags('cards')
@Controller('cards')
export class CardController {
    constructor(private readonly cardService: CardService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo cartão para um usuário' })
    @ApiResponse({ status: 201, description: 'Cartão criado com sucesso' })
    @ApiBody({ type: CreateCardDto })
    create(@Body() createCardDto: CreateCardDto) {
        console.log('🔍 Dados recebidos no controller:', createCardDto);
        console.log('🔍 Tipo de cada campo:', {
            nameCard: typeof createCardDto.nameCard,
            cardNumber: typeof createCardDto.cardNumber,
            securityCode: typeof createCardDto.securityCode,
            expiresDate: typeof createCardDto.expiresDate,
            userId: typeof createCardDto.userId,
        });

        return this.cardService.create(createCardDto);
    }

    @Put(':cardId')
    @ApiOperation({ summary: 'Editar um cartão pelo ID do cartão' })
    @ApiParam({ name: 'cardId', description: 'UUID do cartão' })
    @ApiResponse({ status: 200, description: 'Cartão editado com sucesso' })
    @ApiBody({ type: UpdateCardDto })
    edit(@Param('cardId') cardId: string, @Body() editCardDto: UpdateCardDto) {
        return this.cardService.edit(cardId, editCardDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os cartões' })
    @ApiResponse({ status: 200, description: 'Cartões retornados com sucesso' })
    findAll() {
        return this.cardService.findAll();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Busca todos os cartões de um usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Cartões do usuário retornados com sucesso' })
    findByUser(@Param('userId') userId: string) {
        return this.cardService.findByUser(userId);
    }

    @Delete(':cardId')
    @ApiOperation({ summary: 'Deleta um cartão pelo ID' })
    @ApiParam({ name: 'cardId', description: 'UUID do cartão' })
    @ApiResponse({ status: 200, description: 'Cartão removido com sucesso' })
    delete(@Param('cardId') cardId: string) {
        return this.cardService.delete(cardId);
    }
}