import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
const mockCredentialsDTO = { username: 'testuser', password: 'Testuser123$%' };
describe('User repo', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('Sign up', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });
    it('Sign up method success', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDTO)).resolves.not.toThrow();
    });
    it('Throws error (Conflict exception)/Duplicate user', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        ConflictException,
      );
    });
    it('Throws error (Conflict exception)', () => {
      save.mockRejectedValue({ code: '123123' });
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe('Validating user password', () => {
    let user;
    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUser';
      user.validatePassword = jest.fn();
    });
    it('Returns username for successful validation', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(
        mockCredentialsDTO,
      );
      expect(result).toEqual('TestUser');
    });
    it('Returns null for no user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(
        mockCredentialsDTO,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    it('Returns null if password invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(
        mockCredentialsDTO,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
  describe('Hashing password', () => {
    it('SHould generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
