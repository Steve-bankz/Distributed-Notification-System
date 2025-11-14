// ...existing code...
import AppError from "../lib/utils/AppError.js"
import AuthUtils, { authUser } from "../lib/utils/auth.js"
import {
  push_token_schema,
  update_preferences_schema,
  update_user_schema,
  user_schema,
} from "../schema/user.schema.js"

const user_route = async (fastify: any) => {
  const authUtils = new AuthUtils()

  fastify.addHook("preHandler", authUser(authUtils))

  // GET user
  fastify.get(
    "",
    {
      schema: {
        description: "Get user information by user ID.",
        tags: ["User"],
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: user_schema,
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (_request: any, reply: any) => {
      try {
        const user_id = _request.user?.user_id
        if (!user_id) throw new AppError("User ID not found in request", 401)
        const [[user]] = await fastify.mysql.query(
          "SELECT * FROM users WHERE user_id = ?",
          [user_id],
        )
        if (!user) throw new AppError("User not found", 404)
        reply.code(200).send({
          success: true,
          data: user,
        })
      } catch (error: any) {
        if (error instanceof AppError) {
          reply.code(error.statusCode).send({
            success: false,
            message: error.message,
          })
        } else {
          throw new AppError("Unable to fetch user", 500)
        }
      }
    },
  )

  // PATCH user (name/email)
  fastify.patch(
    "",
    {
      schema: {
        description: "Update user's name and email.",
        tags: ["User"],
        body: update_user_schema,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: user_schema,
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: any, reply: any) => {
      try {
        const { name, email } = request.body
        const user_id = request.user?.user_id
        if (!user_id) throw new AppError("User ID not found in request", 401)
        const setClauses: string[] = []
        const values: any[] = []
        if (name !== undefined) {
          setClauses.push("name = ?")
          values.push(name)
        }
        if (email !== undefined) {
          setClauses.push("email = ?")
          values.push(email)
        }
        if (setClauses.length === 0) {
          throw new AppError(
            "No valid fields to update. Only 'name' and 'email' can be updated.",
            400,
          )
        }
        await fastify.mysql.query(
          `UPDATE users SET ${setClauses.join(", ")} WHERE user_id = ?`,
          [...values, user_id],
        )
        const [[updatedUser]] = await fastify.mysql.query(
          "SELECT * FROM users WHERE user_id = ?",
          [user_id],
        )
        reply.code(200).send({
          success: true,
          message: "User information updated successfully",
          data: updatedUser,
        })
      } catch (error: any) {
        if (error instanceof AppError) {
          reply.code(error.statusCode).send({
            success: false,
            message: error.message,
          })
        } else {
          throw new AppError("Unable to apply updates. Please try again", 500)
        }
      }
    },
  )

  // PATCH preferences
  fastify.post(
    "/preferences",
    {
      schema: {
        description: "Update user's notification preferences.",
        tags: ["User"],
        body: update_preferences_schema,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  preferences: {
                    type: "object",
                    properties: {
                      push_notification_enabled: { type: "boolean" },
                      email_notification_enabled: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: any, reply: any) => {
      try {
        const user_id = request.user?.user_id
        if (!user_id) throw new AppError("User ID not found in request", 401)
        const { preferences } = request.body
        const [[user]] = await fastify.mysql.query(
          "SELECT preferences FROM users WHERE user_id = ?",
          [user_id],
        )
        const currentPreferences = user?.preferences
          ? user.preferences
          : {
              push_notification_enabled: false,
              email_notification_enabled: false,
            }
        const updatedPreferences = { ...currentPreferences, ...preferences }
        await fastify.mysql.query(
          "UPDATE users SET preferences = ? WHERE user_id = ?",
          [JSON.stringify(updatedPreferences), user_id],
        )
        reply.code(200).send({
          success: true,
          message: "User preferences updated successfully",
          data: { preferences: updatedPreferences },
        })
      } catch (error: any) {
        if (error instanceof AppError) {
          reply.code(error.statusCode).send({
            success: false,
            message: error.message,
          })
        } else {
          throw new AppError("Unable to update user preferences", 500)
        }
      }
    },
  )

  // PATCH push tokens
  fastify.post(
    "/push-tokens",
    {
      schema: {
        description: "Add a push token for the user.",
        tags: ["User"],
        body: push_token_schema,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: { type: "object", nullable: true },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: any, reply: any) => {
      try {
        const token = request.body.token
        const user_id = request.user?.user_id
        if (!user_id) throw new AppError("User ID not found in request", 401)
        const [[user]] = await fastify.mysql.query(
          "SELECT push_tokens FROM users WHERE user_id = ?",
          [user_id],
        )
        const currentTokens = user?.push_tokens || []
        if (currentTokens.includes(token)) {
          return reply.code(200).send({
            success: true,
            message: "Push token already exists",
            data: null,
          })
        }
        const updatedTokens = [...currentTokens, token]
        await fastify.mysql.query(
          "UPDATE users SET push_tokens = ? WHERE user_id = ?",
          [JSON.stringify(updatedTokens), user_id],
        )
        reply.code(200).send({
          success: true,
          message: "User push tokens updated successfully",
          data: { push_tokens: updatedTokens },
        })
      } catch (error: any) {
        if (error instanceof AppError) {
          reply.code(error.statusCode).send({
            success: false,
            message: error.message,
          })
        } else {
          throw new AppError("Unable to update push tokens", 500)
        }
      }
    },
  )
}

export default user_route
