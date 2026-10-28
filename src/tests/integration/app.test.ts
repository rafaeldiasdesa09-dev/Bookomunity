
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";

describe("Aplicação Express", () => {
  it("retorna 404 para uma rota inexistente", async () => {
    const response = await request(app).get(
      "/rota-inexistente-para-teste"
    );

    expect(response.status).toBe(404);
  });
});
