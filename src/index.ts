import checkInitializeProjectSettings from '@lib/startup/checkInitialProjectSettings';
import io from '@src/io';
import connectDB from '@lib/startup/connectDB';
import { ServerStarter } from 'express-quick-builder';
import cron from '@lib/middlewares/cron';
import morgan from '@lib/middlewares/morgan';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiter } from '@util/Middleware';
import Assets from '@util/Assets';
import ipfilter from '@lib/middlewares/ipfilter';
import fileUploader from 'express-fileupload';
import express from 'express';
import packageJson from '../package.json';

const PORT: number = parseInt(process.env.PORT || '4000', 10);

const REQUEST_HANDLERS = [
  morgan(),
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  }),
  helmet(),
  RateLimiter(),
  Assets.wrapper(ipfilter),
  fileUploader({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/file/',
    debug: process.env.NODE_ENV === 'development',
  }),
  express.static('public'),
  express.json({ limit: '25mb' }),
  express.urlencoded({ extended: true, limit: '25mb' }),
];

const STARTUP_EXECUTES = [checkInitializeProjectSettings, cron, connectDB];

export function Root(port = PORT): ReturnType<typeof ServerStarter> {
  const server = ServerStarter({
    port,
    routePath: `${process.cwd()}/routes`,
    requestHandlers: REQUEST_HANDLERS,
    executes: STARTUP_EXECUTES,
    portStrict: process.env.PORT_STRICT === 'true' ? true : false,
    appName: packageJson.name,
  });
  io(server.server);
  return server;
}

export default Root();
