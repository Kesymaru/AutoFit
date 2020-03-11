import request from "supertest";

import app from "../src/app";
import DB from "./db";

describe("GET /random-url", () => {
  it("should return 404", done => {
    request(app)
      .get("/reset")
      .expect(404, done);
  });
});

describe("Connect to DB", () => {
  it("Should connect to MongoDB", done => {
    return DB
      .connect()
      .then(done)
      .catch((err: Error) => console.log("MongoDB connection error:", err));
  });
});
