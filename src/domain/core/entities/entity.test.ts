import { Entity } from './entity';

class Test extends Entity {}

describe('entity', () => {
  it('should create an id when not inserted in contructor', () => {
    const test = new Test();

    expect(test.id).toEqual(expect.any(String));
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
