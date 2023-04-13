import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInsUseCase } from '@/use-cases/factories/make-validate-check-ins-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInsUseCase = makeValidateCheckInsUseCase()

  await validateCheckInsUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
