import bcrypt from "bcrypt"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import UserModel, { type UserWithoutPassword } from "../../models/user.model.js"

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
      user_id: user.user_id,
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

  async authUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Get token from header
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({
          success: false,
          message: "Access denied. No token provided.",
        })
      }

      const token = authHeader.split(" ")[1]

      if (!token) {
        return reply.status(401).send({
          success: false,
          message: "Access denied. Add JWT bearer Token.",
        })
      }

      // Verify token
      const decoded = await this.verifyToken(
        request.server as FastifyInstance,
        token,
      )

      // Validate user in DB
      const userModel = new UserModel((request.server as FastifyInstance).mysql)
      const dbUser = await userModel.findByUserId(decoded.user_id)
      if (!dbUser) {
        return reply.status(401).send({
          success: false,
          message: "User not found.",
        })
      }

      // Attach user to request
      request.user = dbUser
    } catch (error) {
      return reply.status(401).send({
        success: false,
        message: "Invalid token.",
      })
    }
  }
}

// Export the authUser middleware function
export const authUser = (authUtils: AuthUtils) => {
  return authUtils.authUser.bind(authUtils)
}

export default AuthUtils
