import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { CookieOptions, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response, @Req() req: Request): any {
    //define date with DateTime from luxon plus an hour
    const secondsToAdd = Number.parseInt(24 * 60 * 60 + '', 10);
    const currentTimeInSeconds = new Date().getTime() + secondsToAdd * 1000;

    const cookieOptions: CookieOptions = {
      domain: '.dev.local',
      path: '/',
      expires: new Date(currentTimeInSeconds),
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as CookieOptions['sameSite'],
    };

    res.cookie('example', 'value', cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.headers['origin']) {
      res.setHeader(
        'Access-Control-Allow-Origin',
        req.headers['origin'] as string,
      );
    }
    return res.status(204).send();
  }

  @Get('example')
  getExample(): Record<string, string> {
    return {
      example: 'value',
    };
  }
}
