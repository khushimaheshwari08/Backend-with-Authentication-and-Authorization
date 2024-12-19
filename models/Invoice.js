const { SchemaTypes } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  title: {
    type: SchemaTypes.String,
    required: true,
    trim: true,
  },
  name: {
    type: SchemaTypes.String,
    required: true,
    trim: true,
  },
  amount: {
    type: SchemaTypes.Number,
    required: true,
    min: 0,
  },
  isPaid: {
    type: SchemaTypes.Boolean,
    default: false,
  },
  billPay: {
    type: SchemaTypes.String,
    enum: ["Paid", "Not Paid"],
    default: "Not Paid",
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
  dueDate: {
    type: SchemaTypes.Date,
    required: true,
  },
  isActive: {
    type: SchemaTypes.Boolean,
    default: true,
    required: true,
  },
  map: {
    type: [
      {
        name: {
          type: String,
          trim: true,
          uppercase: true,
        },
        value: {
          type: [
            {
              type: String,
              trim: true,
            },
          ],
        },
      },
    ],
    default: [],
    required: true,
    _id: false,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
