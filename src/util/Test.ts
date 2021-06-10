import { Root } from '../index';
import http from 'http';
import ServerBuilder from 'express-quick-builder';
import mongoose from 'mongoose';

let rootInstance: ReturnType<typeof ServerBuilder['serverStarter']> | undefined;

function createServer(): http.Server {
  rootInstance = Root(63000);
  return rootInstance.server;
}

function closeServer(
  done: any = function (): void {
    return;
  },
): void {
  if (!rootInstance) throw new Error('Root instance is not initialized!');
  rootInstance.server.close();
  mongoose.connection.close();
  rootInstance = undefined;
  done();
}

export default {
  server: {
    create: createServer,
    close: closeServer,
    instance: rootInstance,
  },
};
