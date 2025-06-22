import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateFormDto } from './dto/create-form.dto';
import { FormsService } from './forms.service';
import { FormsDto } from './dto/forms.dto';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form schema' })
  @ApiBody({ type: CreateFormDto })
  @ApiCreatedResponse({
    description: 'Form created successfully',
    type: FormsDto,
  })
  async createForm(@Body() createFormDto: CreateFormDto): Promise<FormsDto> {
    return await this.formsService.create(createFormDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a form schema by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the form' })
  @ApiOkResponse({ description: 'Form retrieved successfully', type: FormsDto })
  async getForm(@Param('id') id: string): Promise<FormsDto> {
    return await this.formsService.findOne(id);
  }
}
