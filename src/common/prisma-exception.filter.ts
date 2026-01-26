import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = `Unique constraint failed on fields: ${(exception.meta?.target as string[])?.join(', ')}`;
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid foreign key reference';
        break;

      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'Relation constraint violation';
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      message,
    });
  }
}
