import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign({}, { sub: user.id })

    const refreshToken = await reply.jwtSign(
      {},
      { sub: user.id, expiresIn: '7d' },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // routes that have cookie access
        secure: true, // HTTPs
        sameSite: true, // accessible only on the same domain
        httpOnly: true, // accessible only through the context of the request and will not be saved within the applications tab
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
