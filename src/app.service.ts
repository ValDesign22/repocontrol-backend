import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi(): string {
    return 'Welcome to RepoControl API!, took a look at the repo at https://github.com/ValDesign22/repocontrol-backend';
  }
}
