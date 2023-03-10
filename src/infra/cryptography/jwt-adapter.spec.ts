import { verify } from 'crypto';
import jwt from 'jsonwebtoken'; 
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any-encrypted-string';      
  },

  verify(): string {
    return 'any-encrypted-string';      
  }
}))

const secretKey = 'any-secret-key'; 
const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter(secretKey);
  return sut; 
}

describe('JwtAdapter', () => {
  it('should calls sign with correct values', async () => {
    const sut = makeSut(); 
    const spysign = jest.spyOn(jwt, 'sign');
 
    await sut.encrypt('any-string');
    expect(spysign).toHaveBeenCalledWith({value: 'any-string'}, secretKey);
  });

  it('should return a encrypted string if sign method on success', async () => {
    const sut = makeSut(); 
 
    const promise =  await sut.encrypt('any-string');
    expect(promise).toEqual('any-encrypted-string');
  });

  it('should calls sign with correct values', async () => {
    const sut = makeSut(); 
     jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
     });
    const promise = sut.encrypt('any-string');
    await expect(promise).rejects.toThrow();
  }); 

  it('Should call verify with correct values', async () => {
    const sut = makeSut()
    const verifySpy = jest.spyOn(jwt, 'verify')
    await sut.decipher('any_token')
    expect(verifySpy).toHaveBeenCalledWith('any_token', secretKey)
  });

  it('Should return a value on verify success', async () => {
    const sut = makeSut()
    const value = await sut.decipher('any_token')
    expect(value).toBe('any-encrypted-string');
  });

  it('Should throw if verify throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error();
    })
    const promise = sut.decipher('any_token')
    await expect(promise).rejects.toThrow()
  })
});