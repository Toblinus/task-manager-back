import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ConfigService implements OnModuleInit {
  async onModuleInit() {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccessTokenSecret(type: 'private' | 'public') {
    return 'access_secret'; // @TODO: add load key
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRefreshTokenSecret(type: 'private' | 'public') {
    return 'refresh_secret'; // @TODO: add load key
  }
}
