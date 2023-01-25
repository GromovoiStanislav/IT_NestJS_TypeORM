import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {

        if (configService.get<string>("NODE_ENV").toLowerCase() === "production") {

          return {
            type: "postgres",
            url: configService.get<string>("PG_URL"),
            synchronize: true,
            autoLoadEntities: true,
            //entities:[User],
            poolSize: 5,
            extra: {
              connectionLimit: 5,
              connectionTimeoutMillis: 1000
            }
          };
        }


        return {
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "postgres",
          password: "root",
          database: "It_blog",
          autoLoadEntities: true,
          synchronize: false,
          //entities:[User],
        };

      },
      inject: [ConfigService]
    })
  ]
})
export class DatabasePostgresModule {
}