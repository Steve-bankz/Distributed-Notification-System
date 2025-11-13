import bcrypt from "bcrypt"
import type { FastifyInstance } from "fastify"
import type { UserWithoutPassword } from "../../models/user.model.js"

export class AuthUtils {
  private saltRounds = 10

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  generateToken(fastify: FastifyInstance, user: UserWithoutPassword): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    return fastify.jwt.sign(payload)
  }

  async verifyToken(fastify: FastifyInstance, token: string): Promise<any> {
    try {
      return await fastify.jwt.verify(token)
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
}

export default AuthUtils
