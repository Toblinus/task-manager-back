import { Injectable } from '@nestjs/common';
import { Task } from './db';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const task = new Task({
      text: 'from nest',
    });

    await task.save();
    return task._id.toString('hex');
  }
}
