import { Exception } from '@monorepo/exceptions';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ControllerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse() as Response;

    return next.handle().pipe(
      map((apiResponse) => {
        const noContent = apiResponse == null;
        const statusCode = noContent ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return response.status(statusCode).json(apiResponse);
      }),

      catchError((error) => {
        const statusCode =
          error instanceof Exception
            ? error.statusCode
            : HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(statusCode).json({ error: error.message });

        return throwError(() => ({
          statusCode,
          message: error.message || 'Erro interno do servidor',
          error: error.name || 'InternalServerError',
        }));
      })
    );
  }
}
