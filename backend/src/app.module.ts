import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as fs from 'fs';
const tunnel = require('tunnel-ssh').createTunnel;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return new Promise((resolve, reject) => {
          const tunnelConfig = {
            host: configService.get<string>('SSH_HOST'),
            port: configService.get<number>('SSH_PORT'),
            username: configService.get<string>('SSH_USER'),
            privateKey: fs.readFileSync(
              configService.get<string>('SSH_KEY_PATH'),
            ),
            dstHost: configService.get<string>('DB_HOST'),
            dstPort: configService.get<number>('DB_PORT'),
            localHost: '127.0.0.1',
            localPort: configService.get<number>('PORT'),
          };

          tunnel(tunnelConfig, async (error, server) => {
            if (error) {
              console.error('SSH 터널 생성 실패:', error);
              return reject(error);
            }
            console.log(
              'SSH 터널 생성 성공. 로컬 포트:',
              tunnelConfig.localPort,
            );

            resolve({
              type: 'mysql',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              entities: [__dirname + '/**/*.entity.{js,ts}'],
              ssl: {
                rejectUnauthorized: false,
              },
              namingStrategy: new SnakeNamingStrategy(),
            });
          });
        });
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
