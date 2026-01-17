import Order from "../models/Order.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('relatedUser', 'name email').sort({ delivery_date: -1, createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const orderData = { ...req.body };
        const { name, email, whatsapp_no } = orderData;

        // Try to link with existing client or create new one
        if (name || email || whatsapp_no) {
            const Client = (await import("../models/Client.js")).default;

            // Try to find client by unique identifiers
            let client = null;
            if (email) client = await Client.findOne({ email });
            if (!client && whatsapp_no) client = await Client.findOne({ phone: whatsapp_no });
            if (!client && name) client = await Client.findOne({ name }); // Fallback to name

            if (client) {
                orderData.client = client._id;
            } else {
                // Create new client if enough info
                try {
                    client = new Client({
                        name: name || "Unknown",
                        email: email || `temp_${Date.now()}@example.com`,
                        phone: whatsapp_no || "0000000000",
                        type: "Regular", // Default
                        source: "Order"
                    });
                    await client.save();
                    orderData.client = client._id;
                } catch (clientErr) {
                    console.error("Auto-create client failed:", clientErr);
                    // Proceed without linking if client creation fails
                }
            }
        }

        const order = new Order(orderData);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
