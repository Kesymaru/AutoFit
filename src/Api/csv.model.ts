import mongoose from "mongoose";

export interface ICsvRow {
    uuid: string;
    vin: string;
    make: string;
    model: string;
    mileage: string;
    year: string;
    price: string;
    zipCode: string;
    createDate: Date;
    updateDate: Date;
}

export interface ICsv extends mongoose.Document{
    data: Array<ICsvRow>;
}

export const columnsTypes: {[key: string]: any} = {
    "uuid": "string",
    "vin": "string",
    "make": "string",
    "model": "string",
    "mileage": "string",
    "year": "number",
    "price": "number",
    "zipCode": "string",
    "createDate": "date",
    "updateDate": "date",
};

export const columns = Object.keys(columnsTypes);

const CsvSchema = new mongoose.Schema({
    provider: {type: String, required: true},
    data: [{
        uuid: {type: String, required: true},
        vin: {type: String, required: true},
        make: {type: String, required: true},
        model: {type: String, required: true},
        mileage: {type: String, required: true},
        year: {type: Number, required: true},
        price: {type: Number, required: true},
        zip_code: {type: String, required: true},
        create_date: {type: Date, required: true},
        update_date: {type: Date, required: true},
    }]
}, { timestamps: true });

const Csv = mongoose.model<ICsv>("Csv", CsvSchema);
export default Csv;
