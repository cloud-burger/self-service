import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { ProductCategory } from '../entities/value-objects/enums/product-category';
import { ProductRepository } from '../repositories/product';
import { CreateProductUseCase } from './create-product';

describe('create product use case', () => {
  let productRepository: MockProxy<ProductRepository>;
  let createProductUseCase: CreateProductUseCase;

  beforeAll(() => {
    productRepository = mock();
    createProductUseCase = new CreateProductUseCase(productRepository);
  });

  it('should throw conflict error while create product when product already exists', async () => {
    productRepository.findByCategoryAndName.mockResolvedValue(makeProduct());

    await expect(
      createProductUseCase.execute({
        amount: 10,
        category: ProductCategory.DRINK,
        description:
          'Cerveja que leva um blend de leveduras, tendo uma delas a belga, que traz um sutil condimentado, que ajuda no aumento a complexidade de aromas e sabores frutados.',
        name: 'Cerveja IPA',
      }),
    ).rejects.toThrow('Product already exists');

    expect(productRepository.findByCategoryAndName).toHaveBeenNthCalledWith(
      1,
      'DRINK',
      'Cerveja IPA',
    );
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('should create product successfully', async () => {
    productRepository.findByCategoryAndName.mockResolvedValue(null);
    productRepository.create.mockResolvedValue();

    const product = await createProductUseCase.execute({
      amount: 10,
      category: ProductCategory.DRINK,
      description:
        'Cerveja que leva um blend de leveduras, tendo uma delas a belga, que traz um sutil condimentado, que ajuda no aumento a complexidade de aromas e sabores frutados.',
      name: 'Cerveja IPA',
    });

    expect(product).toEqual({
      amount: 10,
      category: 'DRINK',
      createdAt: expect.any(Date),
      description:
        'Cerveja que leva um blend de leveduras, tendo uma delas a belga, que traz um sutil condimentado, que ajuda no aumento a complexidade de aromas e sabores frutados.',
      id: expect.any(String),
      name: 'Cerveja IPA',
      updatedAt: expect.any(Date),
    });
    expect(productRepository.findByCategoryAndName).toHaveBeenNthCalledWith(
      1,
      'DRINK',
      'Cerveja IPA',
    );
    expect(productRepository.create).toHaveBeenNthCalledWith(1, {
      amount: 10,
      category: 'DRINK',
      createdAt: expect.any(Date),
      description:
        'Cerveja que leva um blend de leveduras, tendo uma delas a belga, que traz um sutil condimentado, que ajuda no aumento a complexidade de aromas e sabores frutados.',
      id: expect.any(String),
      name: 'Cerveja IPA',
      updatedAt: expect.any(Date),
    });
  });
});
