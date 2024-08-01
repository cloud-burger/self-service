import { DatabaseOrderMapper } from './database-order';

describe('database order mapper', () => {
  it('should map to domain', () => {
    expect(
      DatabaseOrderMapper.toDomain({
        amount: 10,
        created_at: '2024-01-01',
        id: '123',
        products: [
          {
            amount: 10,
            category: 'BURGER',
            created_at: '2024-01-01',
            description: 'Hamburger de salmão',
            id: '123',
            name: 'X-Salmão',
            updated_at: '2024-01-01',
            image: null,
          },
        ],
        status: 'DONE',
        updated_at: '2024-01-01',
        customer: {
          created_at: '2024-01-01',
          document_number: '01234567890',
          id: '123',
          name: 'John Due',
          updated_at: '2024-01-01',
          email: 'john@gmail.com',
        },
        customer_id: '123',
      }),
    ).toEqual({
      amount: 10,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      customer: {
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        documentNumber: '01234567890',
        email: 'john@gmail.com',
        id: '123',
        name: 'John Due',
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
      id: '123',
      products: [
        {
          amount: 10,
          category: 'BURGER',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          description: 'Hamburger de salmão',
          id: '123',
          image: null,
          name: 'X-Salmão',
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ],
      status: 'DONE',
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });
  });
});
