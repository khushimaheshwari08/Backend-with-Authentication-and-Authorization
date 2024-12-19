const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  findInvoiceByID,
  // filterInvoicesByDateRange,
  updatePaymentStatus,
  updateInvoiceDueDate,
  deleteInvoiceByID,
  handlemapValueUpdate,
  deleteMapValue,
  concatMapValue,
  filterInvoicesByMonthAndYear,
} = require("../controllers/invoiceController");
const invoiceRouter = express.Router();

invoiceRouter.post("/invoice/create", createInvoice);
invoiceRouter.get("/invoice/findAll", getAllInvoices);
invoiceRouter.get("/invoice/getByID/:invoiceID", findInvoiceByID);
// invoiceRouter.get("/invoice/filterByDate", filterInvoicesByDateRange);
invoiceRouter.post("/invoice/updateDueDate/:invoiceID", updateInvoiceDueDate);
invoiceRouter.post(
  "/invoice/updatePaymentStatus/:invoiceID",
  updatePaymentStatus
);
invoiceRouter.delete("/invoice/delete/:invoiceID", deleteInvoiceByID);
invoiceRouter.post("/invoice/updateMap", handlemapValueUpdate);
invoiceRouter.post("/invoice/map/valueDelete", deleteMapValue);
invoiceRouter.post("/invoice/map/concat", concatMapValue);
invoiceRouter.get(
  "/invoice/filter-by-month-year",
  filterInvoicesByMonthAndYear
);

module.exports = invoiceRouter;
