import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
describe('User entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'lalleBoi';
    bcrypt.hash = jest.fn();
  });
  describe('Validate Pwd', () => {
    it('returns true if pwd valid', () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'lalleBoi');
      expect(result).toEqual(true);
    });
    it('returns false if pwd invalid', () => {
      bcrypt.hash.mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'lalleBoi');
      expect(result).toEqual(false);
    });
  });
});
