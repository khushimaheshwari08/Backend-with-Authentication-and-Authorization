const Invoice = require("../models/Invoice");

async function createInvoice(title, name, amount, dueDate, createdAt, map) {
  const invoiceObj = {
    title,
    name,
    amount,
    dueDate,
    createdAt,
    map,
  };

  const invoice = new Invoice(invoiceObj);
  const result = await invoice.save();

  if (!result) {
    return null;
  }
  return invoice._id;
}

async function getAllInvoices() {
  const invoices = await Invoice.find({ isActive: true });
  if (!invoices.length) {
    return [];
  }
  return invoices;
}

async function findInvoiceByID(id) {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    return null;
  }
  return invoice;
}

// async function filterInvoicesByDateRange(startDate, endDate) {
//   const invoices = await Invoice.find({
//     createdAt: {
//       $gte: new Date(startDate), //greater than or equal
//       $lte: new Date(endDate), //less than or equal
//     },
//     isActive: true,
//   });
//   return invoices;
// }

async function filterInvoicesByMonthAndYear(month, year) {
  const invoices = await Invoice.find({
    $expr: {
      $and: [
        { $eq: [{ $month: "$createdAt" }, month] },
        { $eq: [{ $year: "$createdAt" }, year] },
      ],
    },
    isActive: true,
  });

  return invoices;
}

async function updateDueDate(invoiceID, newDueDate) {
  const result = await Invoice.updateOne(
    { _id: invoiceID },
    { dueDate: new Date(newDueDate) }
  );

  if (result.modifiedCount > 0) {
    return true;
  }
  return false;
}

async function updatePaymentStatus(invoiceID, isPaid) {
  const result = await Invoice.updateOne(
    { _id: invoiceID },
    { isPaid, billPay: isPaid ? "Paid" : "Not Paid" }
  );
  if (result.modifiedCount > 0) {
    return true;
  }
  return false;
}

async function deleteInvoiceByID(invoiceID) {
  const result = await Invoice.updateOne(
    { _id: invoiceID },
    { isActive: false }
  );
  if (result.modifiedCount > 0) {
    return true;
  }
  return false;
}

async function updateArrayMapValue(invoiceId, mapName, mapValueElement) {
  const result = await Invoice.updateOne(
    { _id: invoiceId, "map.name": mapName },
    {
      $push: {
        "map.$.value": mapValueElement,
      },
    }
  );
  if (!result) {
    return null;
  }
  return result;
}

async function deleteMapValue(invoiceId, mapName, valueToRemove) {
  const result = await Invoice.updateOne(
    { _id: invoiceId, "map.name": mapName },
    {
      $pull: {
        "map.$.value": valueToRemove,
      },
    }
  );
  if (!result) {
    return null;
  }
  return result;
}

async function concatMapValue(invoiceId, mapName, valuesToAdd) {
  const result = await Invoice.updateOne(
    { _id: invoiceId, "map.name": mapName },
    {
      $push: {
        "map.$.value": { $each: valuesToAdd }, // Append multiple values
      },
    }
  );

  return result;
}

module.exports = {
  createInvoice,
  getAllInvoices,
  findInvoiceByID,
  // filterInvoicesByDateRange,
  updateDueDate,
  updatePaymentStatus,
  deleteInvoiceByID,
  updateArrayMapValue,
  deleteMapValue,
  concatMapValue,
  filterInvoicesByMonthAndYear,
};
