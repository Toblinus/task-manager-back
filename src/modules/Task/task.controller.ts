import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller({
  path: '/task',
})
export class TaskController {
  constructor(private readonly appService: TaskService) {}

  @Post()
  postCreateTask(@Body() body) {

    
    return this.appService.create({ author: '', text: 'test' });
  }
}
