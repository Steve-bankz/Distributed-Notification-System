// schema/user.schema.ts
export const user_schema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    user_id: { type: "string", format: "uuid" },
    name: { type: "string" },
    email: { type: "string" },
    preferences: {
      type: "object",
      properties: {
        push_notification_enabled: { type: "boolean" },
        email_notification_enabled: { type: "boolean" },
      },
      additionalProperties: false,
    },
    push_tokens: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["id", "name", "email", "user_id", "preferences", "push_tokens"],
  additionalProperties: false,
}

export const update_user_schema = {
  type: "object",
  properties: {
    name: { type: "string", nullable: true },
    email: { type: "string", nullable: true },
  },
  additionalProperties: false,
}

export const update_preferences_schema = {
  type: "object",
  properties: {
    preferences: {
      type: "object",
      properties: {
        push_notification_enabled: { type: "boolean", nullable: true },
        email_notification_enabled: { type: "boolean", nullable: true },
      },
      additionalProperties: false,
    },
  },
  required: ["preferences"],
  additionalProperties: false,
}

export const push_token_schema = {
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: ["token"],
  additionalProperties: false,
}
