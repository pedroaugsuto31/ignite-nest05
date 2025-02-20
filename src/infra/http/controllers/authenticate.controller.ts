import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const authenticateBodyShema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodyShema = z.infer<typeof authenticateBodyShema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodyShema))
  async handle(@Body() body: AuthenticateBodyShema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
