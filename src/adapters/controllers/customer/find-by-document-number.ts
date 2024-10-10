import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { CustomerPresenter } from '~/presenters/customer/customer';
import { CustomerResponse } from '~/presenters/customer/dtos/customer-response';
import { FindCustomerByDocumentNumberUseCase } from '~/use-cases/customer/find-by-document-number';

export class FindCustomerByDocumentNumberController {
  constructor(
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<CustomerResponse>> => {
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
      body: CustomerPresenter.toHttp(customer),
    };
  };
}
