import AppError from "./lib/helpers/AppError.js";

export const template_routes = async (fastify: any) => {
  fastify.get("/", async (_request: any, reply: any) => {
    try {
      const [templates] = await fastify.mysql.query("SELECT * FROM templates");
      reply.code(200).send({
        success: true,
        data: templates,
        meta: { total: templates.length },
      });
    } catch {
      throw new AppError("Failed to fetch templates", 500);
    }
  });

  fastify.post("/", async (request: any, reply: any) => {
    try {
      if (!request.body) {
        return reply.send(new AppError("Missing required fields", 400));
      }

      const { name, subject, body } = request.body;

      if (!request.body || !name || !subject || !body) {
        return reply.send(new AppError("Missing required fields", 400));
      }

      const [template] = await fastify.mysql.query(
        "INSERT INTO templates (name, subject, body) VALUES (?, ?, ?)",
        [name, subject, body]
      );

      reply.code(201).send({
        success: true,
        data: { id: template.insertId, name, subject, body },
      });
    } catch {
      throw new AppError("Failed to create template", 500);
    }
  });

  fastify.get("/:template_code", async (request: any, reply: any) => {
    try {
      const { template_code } = request.params;
      const [[template]] = await fastify.mysql.query(
        "SELECT * FROM templates WHERE name = ?",
        [template_code]
      );

      if (!template) return reply.send(new AppError("Template not found", 404));

      reply.code(200).send({
        success: true,
        data: template,
      });
    } catch {
      throw new AppError("Unable to fetch template", 404);
    }
  });

  fastify.patch(
    "/templates/:template_code",
    async (request: any, reply: any) => {
      try {
        const { template_code } = request.params;
        const fields = request.body;

        if (!fields || !Object.keys(fields).length) {
          return reply.send(new AppError("No fields provided for update", 400));
        }

        const setClauses = [];
        const values = [];

        for (const [key, value] of Object.entries(fields)) {
          setClauses.push(`${key} = ?`);
          values.push(value);
        }

        const sql = `UPDATE templates SET ${setClauses.join(
          ", "
        )} WHERE name = ?`;
        values.push(template_code);

        const [result] = await fastify.mysql.query(sql, values);

        if (result.affectedRows === 0) {
          return reply.send(new AppError("Template not found", 404));
        }

        reply.send({
          success: true,
          message: "Template updated successfully",
          data: fields,
        });
      } catch (error) {
        throw new AppError("Failed to update template", 500);
      }
    }
  );

  fastify.delete("/:template_code", async (request: any, reply: any) => {
    try {
      const { template_code } = request.params;

      const [[template]] = await fastify.mysql.query(
        "SELECT * FROM templates WHERE name = ?",
        [template_code]
      );

      if (!template) {
        return reply.send(new AppError("Template not found", 404));
      }

      await fastify.mysql.query("DELETE FROM templates WHERE name = ?", [
        template_code,
      ]);
      reply.code(204).send();
    } catch {
      throw new AppError("Failed to delete template", 500);
    }
  });
};
