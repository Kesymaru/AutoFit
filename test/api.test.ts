import request from "supertest";
import app from "../src/app";

// const url = `'${process.env["API_PREFIX"]}'/csv`;
const url = "/api/v1/csv";

describe(`Post ${url}`, () => {
  it("should return 400 when there ir no data", () => {
    return request(app)
      .post(url)
      .expect(400);
  });

  it("should return 400 when CSV file is missing", () => {
    return request(app)
      .post(url)
      .field("provider", "Provider Test")
      .expect(400);
  });

  it("should return 400 when Provider is missing", () => {
    return request(app)
      .post(url)
      .attach("csv", `${__dirname}/csv/valid.csv`)
      .expect(400);
  });

  it("Should return 500 when CSV file is missing required columns", () => {
    return request(app)
      .post(url)
      .field("provider", "Provider Test")
      .attach("csv", `${__dirname}/csv/invalid.csv`)
      .expect(500);
  });

  it("Should upload CSV file", done => {
    return request(app)
      .post(url)
      .field("provider", "Provider Test")
      .attach("csv", `${__dirname}/csv/valid.csv`)
      .expect(201)
      .end((err, res) => err ? done(err) : done());
  });
});
