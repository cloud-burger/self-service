import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Customer } from '~/domain/customer/entities/customer';
import { FindCustomerByDocumentNumberUseCase } from '~/domain/customer/use-cases/find-by-document-number';

export class FindCustomerByDocumentNumberController {
  constructor(
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<Customer>> => {
    const { documentNumber } = request.pathParameters;

    logger.info({
      message: 'Find customer by document number request',
      data: request,
    });

    const customer = await this.findCustomerByDocumentNumberUseCase.execute({
      documentNumber,
    });

    return {
      statusCode: 200,
      body: customer,
    };
  };
}
