import { makeProduct } from 'tests/factories/make-product';
import { DatabaseProductMapper } from './database-product';

describe('database product mapper', () => {
  it('should map to database', () => {
    expect(DatabaseProductMapper.toDatabase(makeProduct())).toEqual({
      amount: 20.99,
      category: 'BURGER',
      created_at: '2024-07-12T22:18:26.351Z',
      description:
        'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      image: null,
      name: 'Bacon Burger',
      updated_at: '2024-07-12T22:18:26.351Z',
    });
  });

  it('should map to domain', () => {
    expect(
      DatabaseProductMapper.toDomain({
        amount: 20.99,
        category: 'BURGER',
        created_at: '2024-07-12T22:18:26.351Z',
        description:
          'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        image: null,
        name: 'Bacon Burger',
        updated_at: '2024-07-12T22:18:26.351Z',
      }),
    ).toEqual({
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
  });
});
