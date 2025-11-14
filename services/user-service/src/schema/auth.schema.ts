const registerSchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["email", "password", "name"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "User email address",
      },
      password: {
        type: "string",
        minLength: 6,
        description: "User password (minimum 6 characters)",
      },
      name: {
        type: "string",
        minLength: 2,
        description: "User full name",
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "number" },
                email: { type: "string" },
                name: { type: "string" },
                created_at: { type: "string" },
              },
            },
            token: { type: "string" },
          },
        },
      },
    },
    400: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    409: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
}

const loginSchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "User email address",
      },
      password: {
        type: "string",
        description: "User password",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "number" },
                email: { type: "string" },
                name: { type: "string" },
                created_at: { type: "string" },
              },
            },
            token: { type: "string" },
          },
        },
      },
    },
    400: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
}

export { loginSchema, registerSchema }
