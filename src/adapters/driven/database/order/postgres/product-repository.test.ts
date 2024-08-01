import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import Connection from '~/app/postgres/connection';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';
import { ProductRepository } from './product-repository';

describe('product repository', () => {
  let connection: MockProxy<Connection>;
  let productRepository: ProductRepository;

  beforeAll(() => {
    connection = mock();
    productRepository = new ProductRepository(connection);
  });

  it('should create product successfully', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    await productRepository.create(makeProduct());

    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        amount: 20.99,
        category: 'BURGER',
        created_at: '2024-07-12T22:18:26.351Z',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        image: null,
        name: 'Bacon Burger',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'INSERT INTO public.products (id,amount,category,description,name,created_at,updated_at) VALUES (:id,:amount,:category,:description,:name,:created_at,:updated_at)',
    });
  });

  it('should update product successfully', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    await productRepository.update(makeProduct());

    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        amount: 20.99,
        category: 'BURGER',
        created_at: '2024-07-12T22:18:26.351Z',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        image: null,
        name: 'Bacon Burger',
        updated_at: '2024-07-12T22:18:26.351Z',
      },
      sql: 'UPDATE public.products SET name=:name, category=:category, description=:description, amount=:amount, image=:image, updated_at=:updated_at WHERE id=:id;',
    });
  });

  it('should return null while find product by category and name and product does not exists', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    const product = await productRepository.findByCategoryAndName(
      ProductCategory.BURGER,
      'X-Salada',
    );

    expect(product).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { category: 'BURGER', name: 'x-salada' },
      sql: 'SELECT * FROM public.products WHERE category = :category and lower(name) = :name',
    });
  });

  it('should find product by category and name successfully', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          amount: '20.99',
          category: 'BURGER',
          created_at: '2024-07-12T22:18:26.351Z',
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          updated_at: '2024-07-12T22:18:26.351Z',
        },
      ],
    });

    const product = await productRepository.findByCategoryAndName(
      ProductCategory.BURGER,
      'Bacon Burger',
    );

    expect(product).toEqual({
      amount: 20.99,
      category: 'BURGER',
      createdAt: new Date('2024-07-12T22:18:26.351Z'),
      description:
        'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      image: null,
      name: 'Bacon Burger',
      updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    });
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { category: 'BURGER', name: 'bacon burger' },
      sql: 'SELECT * FROM public.products WHERE category = :category and lower(name) = :name',
    });
  });

  it('should return null while find product by id and product does not exists', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    const product = await productRepository.findById('2123');

    expect(product).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { id: '2123' },
      sql: 'SELECT * FROM public.products WHERE id = :id',
    });
  });

  it('should find product by id successfully', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          amount: '20.99',
          category: 'BURGER',
          created_at: '2024-07-12T22:18:26.351Z',
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          updated_at: '2024-07-12T22:18:26.351Z',
        },
      ],
    });

    const product = await productRepository.findById(
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );

    expect(product).toEqual({
      amount: 20.99,
      category: 'BURGER',
      createdAt: new Date('2024-07-12T22:18:26.351Z'),
      description:
        'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      image: null,
      name: 'Bacon Burger',
      updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    });
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: { id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e' },
      sql: 'SELECT * FROM public.products WHERE id = :id',
    });
  });
});
