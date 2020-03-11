import path from "path";
import os from "os";
import { Express, Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import multer, { FileFilterCallback } from "multer";
import csvtojson from "csvtojson";

import HttpStatusCode from "./api.types";
import Csv, { ICsvRow, columns, columnsTypes } from "./csv.model";

class ApiController {
  private readonly prefix: string = process.env["API_PREFIX"];
  private readonly upload: any = multer({
    dest: path.join(os.tmpdir()),
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => (file.mimetype === "text/csv" ? cb(null, true) : cb(null, false))
  });

  /**
   * Set the API routes
   * @param  app
   */
  constructor(app: Express) {
    app.post(
      `${this.prefix}/csv`,
      this.upload.single("csv"),
      this.Post.bind(this)
    );
  }

  public async Post(req: Request, res: Response, next: NextFunction) {
    const file = req.file;
    const { provider } = req.body;

    if (!file)
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        code: HttpStatusCode.BAD_REQUEST,
        message: "CSV file is required"
      });
    if (!provider)
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        code: HttpStatusCode.BAD_REQUEST,
        message: "Provider name is required"
      });

    try {
      await this.processCsv(file, provider, res);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "Error parsing CSV file"
      });
      next(error);
    }
  }

  private async processCsv(
    file: Express.Multer.File,
    provider: string,
    res: Response
  ) {
    let data = await csvtojson().fromFile(file.path);

    // extract wanted columns from csv data
    data = data.map(row =>
      Object.keys(row)
        .filter(key => columns.includes(key.toLowerCase()))
        .reduce(
          (total: any, key: string) => ({
            ...total,
            [`${key.toLowerCase()}`]: row[key]
          }),
          {}
        )
    );

    if (!data || !data.length)
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        code: HttpStatusCode.BAD_REQUEST,
        message: "Invalid CSV data"
      });

    // save the data into db
    const csv = new Csv({ provider, data });
    console.log("csv ->", csv);
    const document = await csv.save();

    return res.status(HttpStatusCode.CREATED).json({
      code: HttpStatusCode.CREATED,
      message: "CSV processed successfully",
      result: document
    });
  }
}

export default ApiController;
