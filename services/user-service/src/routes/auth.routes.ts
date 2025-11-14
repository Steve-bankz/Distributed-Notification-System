import type { FastifyInstance } from "fastify"
import { v4 as uuidv4 } from "uuid"
import AuthUtils from "../lib/utils/auth.js"
import UserModel, { type UserWithoutPassword } from "../models/user.model.js"
import { loginSchema, registerSchema } from "../schema/auth.schema.js"

const auth_routes = async (fastify: FastifyInstance) => {
  const userModel = new UserModel(fastify.mysql)
  const authUtils = new AuthUtils()

  // Register route
  fastify.post(
    "/register",
    {
      schema: {
        tags: registerSchema.tags,
        body: registerSchema.body,
        response: registerSchema.response,
      },
    },
    async (request, reply) => {
      const { email, password, name } = request.body as {
        email: string
        password: string
        name: string
      }

      if (!password || password.length < 6) {
        return reply.status(400).send({
          success: false,
          message: "Password is required and must be at least 6 characters.",
        })
      }

      // check if user already exists
      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return reply.status(409).send({
          success: false,
          message: "User with this email already exists",
        })
      }
      const hashedPassword = await authUtils.hashPassword(password)
      const user = await userModel.create({
        user_id: uuidv4(),
        email,
        password: hashedPassword,
        name,
      })

      const token = authUtils.generateToken(fastify, user)

      return reply.status(201).send({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            ...(user.created_at && { created_at: user.created_at }),
            ...(user.updated_at && { updated_at: user.updated_at }),
          },
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
        tags: loginSchema.tags,
        body: loginSchema.body,
        response: loginSchema.response,
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
        user_id: user.user_id,
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
          user: {
            user_id: userWithoutPassword.user_id,
            email: userWithoutPassword.email,
            name: userWithoutPassword.name,
            ...(userWithoutPassword.created_at && {
              created_at: userWithoutPassword.created_at,
            }),
            ...(userWithoutPassword.updated_at && {
              updated_at: userWithoutPassword.updated_at,
            }),
          },
          token,
        },
      })
    },
  )
}

export default auth_routes
