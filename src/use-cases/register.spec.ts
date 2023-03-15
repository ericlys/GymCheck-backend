import { RegisterUseCase } from './register'
import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '12345',
    })

    const isPasswordCorrectlyHashed = await compare('12345', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@gmail.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '12345',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
