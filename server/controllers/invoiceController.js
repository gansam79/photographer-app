import Invoice from '../models/Invoice.js';
import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('clientId')
      .populate('quotationId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId')
      .populate('quotationId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create invoice
export const createInvoice = async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const invoiceData = {
      ...req.body,
      invoiceNumber,
    };

    const invoice = new Invoice(invoiceData);
    const savedInvoice = await invoice.save();

    // Update quotation if created from quotation
    if (req.body.quotationId) {
      await Quotation.findByIdAndUpdate(req.body.quotationId, {
        convertedToInvoice: true,
        invoiceId: savedInvoice._id,
        status: 'Accepted',
      });
    }

    // Update client totals
    await Client.findByIdAndUpdate(req.body.clientId, {
      $inc: { totalBilled: savedInvoice.grandTotal },
      pendingAmount: savedInvoice.grandTotal,
    });

    await savedInvoice.populate('clientId');
    await savedInvoice.populate('quotationId');
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('clientId')
      .populate('quotationId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update quotation if it exists
    if (invoice.quotationId) {
      await Quotation.findByIdAndUpdate(invoice.quotationId, {
        convertedToInvoice: false,
        invoiceId: null,
      });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invoices by client
export const getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await Invoice.find({ clientId: req.params.clientId })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invoices by payment status
export const getInvoicesByPaymentStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const invoices = await Invoice.find({ paymentStatus: status })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update invoice payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get overdue invoices
export const getOverdueInvoices = async (req, res) => {
  try {
    const today = new Date();
    const invoices = await Invoice.find({
      dueDate: { $lt: today },
      paymentStatus: { $ne: 'Paid' },
    })
      .populate('clientId')
      .sort({ dueDate: 1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
