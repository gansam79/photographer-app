import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';

// Generate unique quotation number
const generateQuotationNumber = async () => {
  const count = await Quotation.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `QT-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

// Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single quotation
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('clientId');
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create quotation
export const createQuotation = async (req, res) => {
  try {
    const quotationNumber = await generateQuotationNumber();
    const quotationData = {
      ...req.body,
      quotationNumber,
    };

    const quotation = new Quotation(quotationData);
    const savedQuotation = await quotation.save();
    await savedQuotation.populate('clientId');
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update quotation
export const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('clientId');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Duplicate quotation
export const duplicateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const quotationNumber = await generateQuotationNumber();
    const newQuotation = new Quotation({
      ...quotation.toObject(),
      _id: undefined,
      quotationNumber,
      quotationDate: new Date(),
      status: 'Draft',
      convertedToInvoice: false,
      invoiceId: null,
    });

    const savedQuotation = await newQuotation.save();
    await savedQuotation.populate('clientId');
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get quotations by client
export const getQuotationsByClient = async (req, res) => {
  try {
    const quotations = await Quotation.find({ clientId: req.params.clientId })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quotations by status
export const getQuotationsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const quotations = await Quotation.find({ status })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
