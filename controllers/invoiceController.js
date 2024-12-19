const invoiceServices = require("../services/invoiceServices");
const mongoose = require("mongoose");

async function createInvoice(req, res) {
  try {
    const { title, name, amount, dueDate, createdAt, map } = req.body;

    if (!title || !name || !amount || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await invoiceServices.createInvoice(
      title,
      name,
      amount,
      dueDate,
      createdAt,
      map
    );

    if (result) {
      return res
        .status(201)
        .json({ message: "Invoice created successfully", id: result });
    }

    return res.status(400).json({ error: "Invoice not created" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllInvoices(req, res) {
  try {
    const invoices = await invoiceServices.getAllInvoices();

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: "No invoices found" });
    }

    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function findInvoiceByID(req, res) {
  try {
    const invoiceID = req.params.invoiceID;

    if (!invoiceID) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }

    const invoice = await invoiceServices.findInvoiceByID(invoiceID);

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// async function filterInvoicesByDateRange(req, res) {
//   try {
//     const { startDate, endDate } = req.body;
//     if (!startDate || !endDate) {
//       return res
//         .status(400)
//         .json({ error: "Start date and end date are required" });
//     }
//     const invoices = await invoiceServices.filterInvoicesByDateRange(
//       startDate,
//       endDate
//     );
//     if (!invoices) {
//       return res
//         .status(404)
//         .json({ error: "No invoices found in the specific date range" });
//     }

//     return res.status(200).json(invoices);
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// }

async function filterInvoicesByMonthAndYear(req, res) {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required." });
    }

    const invoices = await invoiceServices.filterInvoicesByMonthAndYear(
      parseInt(month),
      parseInt(year)
    );

    if (!invoices) {
      return res.status(404).json({ message: "No invoices found." });
    }

    return res.status(200).json(invoices);
  } catch (err) {
    console.error("Error fetching invoices by month and year:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function updateInvoiceDueDate(req, res) {
  try {
    const { invoiceID } = req.params;
    const { newDueDate } = req.body;

    if (!invoiceID) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }
    if (!newDueDate) {
      return res.status(400).json({ error: "New due date is required" });
    }

    const result = await invoiceServices.updateDueDate(invoiceID, newDueDate);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Invoice not found or update failed" });
    }

    return res.status(200).json({
      message: "Due date updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const { invoiceID } = req.params;
    const { isPaid } = req.body;

    if (!invoiceID) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }
    if (typeof isPaid !== "boolean") {
      return res
        .status(400)
        .json({ error: "Payment status (isPaid) must be true or false" });
    }

    const updatedInvoice = await invoiceServices.updatePaymentStatus(
      invoiceID,
      isPaid
    );

    if (!updatedInvoice) {
      return res
        .status(404)
        .json({ error: "Invoice not found or update failed" });
    }

    return res.status(200).json({
      message: "Payment status updated successfully",
      updatedInvoice,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteInvoiceByID(req, res) {
  try {
    const { invoiceID } = req.params;

    if (!invoiceID) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }

    const result = await invoiceServices.deleteInvoiceByID(invoiceID);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Invoice not found or could not be deleted" });
    }

    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handlemapValueUpdate(req, res) {
  try {
    let { invoiceId, mapName, mapValueElement } = req.body;
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ error: "Invalid invoice ID." });
    }
    if (!mapName) {
      return res.status(400).json({ error: "Map Name not Found" });
    }
    function convertToUpperCase(str) {
      return str.toUpperCase();
    }
    mapName = convertToUpperCase(mapName);
    const result = await invoiceServices.updateArrayMapValue(
      invoiceId,
      mapName,
      mapValueElement
    );
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json({ error: "Invioce not Found!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteMapValue(req, res) {
  try {
    let { invoiceId, mapName, valueToRemove } = req.body;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ error: "Invalid invoice ID." });
    }
    if (!mapName || !valueToRemove) {
      return res
        .status(400)
        .json({ error: "Map name and value to remove are required." });
    }

    const result = await invoiceServices.deleteMapValue(
      invoiceId,
      mapName.toUpperCase(),
      valueToRemove
    );

    if (result) {
      return res.status(200).json({
        message: "Value removed successfully from the map.",
      });
    }

    return res.status(404).json({ error: "Map or value not found." });
  } catch (error) {
    console.error("Error deleting value from map:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function concatMapValue(req, res) {
  try {
    const { invoiceId, mapName, valuesToAdd } = req.body;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ error: "Invalid invoice ID." });
    }
    if (!mapName || !Array.isArray(valuesToAdd) || valuesToAdd.length === 0) {
      return res.status(400).json({
        error: "Map name and non-empty array of values are required.",
      });
    }

    const result = await invoiceServices.concatMapValue(
      invoiceId,
      mapName.toUpperCase(),
      valuesToAdd
    );

    if (result) {
      return res.status(200).json({
        message: "Values successfully appended to the map.",
      });
    }

    return res.status(404).json({ error: "Map not found or update failed." });
  } catch (error) {
    console.error("Error appending values to map:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  createInvoice,
  getAllInvoices,
  findInvoiceByID,
  // filterInvoicesByDateRange,
  updateInvoiceDueDate,
  updatePaymentStatus,
  deleteInvoiceByID,
  handlemapValueUpdate,
  deleteMapValue,
  concatMapValue,
  filterInvoicesByMonthAndYear,
};
