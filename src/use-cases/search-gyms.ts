import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface SearchGymsUseCaseRequest {
  query: string // to search by title, description or etc...
  page: number
}

interface SearchGymUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
