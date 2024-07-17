import { randomUUID } from 'crypto';
import { Entity } from './entity';

jest.mock('crypto');

class Test extends Entity {}

describe('entity', () => {
  const uuidMock = jest.mocked(randomUUID);
  it('should create an id when not inserted in contructor', () => {
    uuidMock.mockReturnValue('232baa95-8a4c-4524-8d7f-b41905c886a4');
    const test = new Test();

    expect(test.id).toEqual('232baa95-8a4c-4524-8d7f-b41905c886a4');
  });

  it('should not create id when is inserted in constructor', () => {
    const test = new Test('1');

    expect(test.id).toEqual('1');
  });

  it('should return false when entity is not equals', () => {
    const testOne = new Test('1');
    const testTwo = new Test('2');

    expect(testOne.equals(testTwo)).toBeFalsy();
  });

  it('should return true when entity is not equals', () => {
    const testOne = new Test('1');
    const testTwo = new Test('1');

    expect(testOne.equals(testTwo)).toBeTruthy();
    expect(testOne.equals(testOne)).toBeTruthy();
  });
});
