import type { FastifyInstance } from "fastify"
import AuthUtils from "../lib/utils/auth.js"
import UserModel, { type UserWithoutPassword } from "../models/user.model.js"
import {
  authResponseSchema,
  loginSchema,
  registerSchema,
} from "../schema/auth.schema.js"

const auth_routes = async (fastify: FastifyInstance) => {
  const userModel = new UserModel(fastify.mysql)
  const authUtils = new AuthUtils()

  // Register route
  fastify.post(
    "/register",
    {
      schema: {
        body: registerSchema.body,
        response: authResponseSchema,
      },
    },
    async (request, reply) => {
      const { email, password, name } = request.body as {
        email: string
        password: string
        name: string
      }

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return reply.status(409).send({
          success: false,
          message: "User with this email already exists",
        })
      }

      // Hash password
      const hashedPassword = await authUtils.hashPassword(password)

      // Create user
      const user = await userModel.create({
        email,
        password: hashedPassword,
        name,
      })

      // Generate token
      const token = authUtils.generateToken(fastify, user)

      return reply.status(201).send({
        success: true,
        message: "User registered successfully",
        data: {
          user,
          token,
        },
      })
    },
  )

  // Login route
  fastify.post(
    "/login",
    {
      schema: {
        body: loginSchema.body,
        response: authResponseSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string
        password: string
      }

      // Find user by email
      const user = await userModel.findByEmail(email)
      if (!user) {
        return reply.status(401).send({
          success: false,
          message: "Invalid email",
        })
      }

      // Compare password
      const isPasswordValid = await authUtils.comparePassword(
        password,
        user.password,
      )
      if (!isPasswordValid) {
        return reply.status(401).send({
          success: false,
          message: "Invalid password",
        })
      }

      // Remove password from user object
      const userWithoutPassword: UserWithoutPassword = {
        id: user.id!,
        email: user.email,
        name: user.name,
        ...(user.created_at && { created_at: user.created_at }),
        ...(user.updated_at && { updated_at: user.updated_at }),
      }

      // Generate token
      const token = authUtils.generateToken(fastify, userWithoutPassword)

      return reply.send({
        success: true,
        message: "Login successful",
        data: {
          user: userWithoutPassword,
          token,
        },
      })
    },
  )
}

export default auth_routes
