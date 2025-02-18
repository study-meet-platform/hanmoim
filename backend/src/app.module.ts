import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as fs from 'fs';
import { Client } from 'ssh2';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return new Promise((resolve, reject) => {
          const sshClient = new Client();

          const sshConfig = {
            host: configService.get<string>('SSH_HOST'), // 서울 EC2의 퍼블릭 IP
            port: configService.get<number>('SSH_PORT') || 22,
            username: configService.get<string>('SSH_USER'),
            privateKey: fs.readFileSync(
              configService.get<string>('SSH_KEY_PATH'),
            ),
          };

          sshClient
            .on('ready', () => {
              console.log('✅ SSH 연결 성공!');

              sshClient.forwardOut(
                '127.0.0.1',
                3307,
                configService.get<string>('DB_HOST'), // RDS 엔드포인트
                configService.get<number>('DB_PORT') || 3306,
                (err, stream) => {
                  if (err) {
                    console.error('❌ 포트 포워딩 실패:', err);
                    sshClient.end();
                    return reject(err);
                  }

                  console.log(
                    `✅ SSH 터널링 성공! RDS 연결 가능: 127.0.0.1:3307`,
                  );

                  resolve({
                    type: 'mysql',
                    host: '127.0.0.1',
                    port: 3307,
                    username: configService.get<string>('DB_USERNAME'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_DATABASE'),
                    entities: [__dirname + '/**/*.entity.{js,ts}'],
                    ssl: {
                      rejectUnauthorized: false,
                    },
                    namingStrategy: new SnakeNamingStrategy(),
                    extra: { stream }, // SSH 터널을 통해 MySQL 연결
                  });
                },
              );
            })
            .on('error', (err) => {
              console.error('❌ SSH 연결 실패:', err);
              reject(err);
            })
            .connect(sshConfig);
        });
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
