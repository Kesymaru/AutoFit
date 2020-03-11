import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose, {ConnectionOptions} from "mongoose";
import bluebird from "bluebird";

mongoose.Promise = bluebird;

const MongooseConfig: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
};

class DB {
  private mongod: MongoMemoryServer;
  constructor() {
    this.mongod = new MongoMemoryServer();
    //this.connect();
  }

  public async connect(config: ConnectionOptions = MongooseConfig) {
    const uri = await this.mongod.getConnectionString();
    await mongoose.connect(uri, config);
  }

  public async close() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.mongod.stop();
  }

  public async clear() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}

export default DB;
