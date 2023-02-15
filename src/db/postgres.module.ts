import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

export const localDbOptions: TypeOrmModuleOptions = {
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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {


        // return {
        //   type: "postgres",
        //   url: configService.get<string>("PG_URL"),
        //   synchronize: true,
        //   autoLoadEntities: true,
        //   poolSize: 5,
        //   extra: {
        //     connectionLimit: 5,
        //     connectionTimeoutMillis: 1000
        //   }
        // };


        if (configService.get<string>("NODE_ENV").toLowerCase() === "production") {

          return {
            type: "postgres",
            url: configService.get<string>("PG_URL"),
            synchronize: true,
            autoLoadEntities: true,
            // poolSize: 5,
            // extra: {
            //   connectionLimit: 5,
            //   connectionTimeoutMillis: 1000
            // }
          };
        }

        return localDbOptions;

      },
      inject: [ConfigService]
    })
  ]
})
export class DatabasePostgresModule {
}