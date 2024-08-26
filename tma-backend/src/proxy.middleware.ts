import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as httpProxy from 'http-proxy';
import { ServerResponse } from 'http';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private proxy: httpProxy;
  private readonly logger = new Logger(ProxyMiddleware.name);

  constructor() {
    this.proxy = httpProxy.createProxyServer({});

    this.proxy.on('proxyReq', (proxyReq, _req, _res, options) => {
      this.logger.log(`Proxying request to: ${options.target}${proxyReq.path}`);
    });

    this.proxy.on('proxyRes', (proxyRes, _req, _res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin,X-Requested-With,Content-Type,Accept,Authorization';
    });

    this.proxy.on('error', (err, _req, res: ServerResponse) => {
      this.logger.error(`Proxy error: ${err}`);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
      }
      res.end('Something went wrong with the proxy.');
    });
  }

  use(req: Request, res: Response, _next: NextFunction) {
    const targetUrl = new URL(req.url.replace('/api/proxy/', ''));
    
    if (targetUrl.hostname === 'github.com') {
      targetUrl.hostname = 'raw.githubusercontent.com';
      targetUrl.pathname = targetUrl.pathname.replace('/blob/', '/');
    }

    this.proxy.web(req, res, {
      target: targetUrl.origin,
      changeOrigin: true,
      secure: true,
      headers: {
        'User-Agent': 'TelegramMiniApp/1.0',
      },
    }, (err) => {
      if (err) {
        this.logger.error(`Proxy error: ${err}`);
        if (!res.headersSent) {
          res.status(500).send('Proxy error occurred');
        }
      }
    });
  }
}

export const proxyMiddlewareConfig = {
  consumer: (consumer: import('@nestjs/common').MiddlewareConsumer) => {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes('/api/proxy');
  }
};