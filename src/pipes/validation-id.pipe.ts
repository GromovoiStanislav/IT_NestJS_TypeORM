import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class ValidationIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (!isNaN(value)) {
      throw new BadRequestException([{ field: "id", message: "Id failed (string is expected)" }]);
    }

    return value;
  }
}