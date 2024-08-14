import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placer une commande utilisateur pour le frontend
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod:req.body.paymentMethod
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Répondre avec succès
        res.json({ success: true, message: "Commande passée avec succès !" });
    } catch (error) {
        console.error("Erreur lors du passage de la commande :", error);
        res.status(500).json({ success: false, message: "Erreur lors du passage de la commande. Veuillez réessayer." });
    }
};

// Récupérer les commandes utilisateur pour le frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes utilisateur :", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des commandes utilisateur. Veuillez réessayer." });
    }
};

// Lister toutes les commandes pour le panneau d'administration
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Erreur lors de la liste des commandes :", error);
        res.status(500).json({ success: false, message: "Erreur lors de la liste des commandes. Veuillez réessayer." });
    }
};

// Mettre à jour le statut de la commande
const updateStatus = async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { status: req.body.status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Commande non trouvée." });
        }

        res.json({ success: true, message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la commande :", error);
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du statut de la commande. Veuillez réessayer." });
    }
};

// Supprimer un Commande
const removeOrder = async (req, res) => {
    try {
        // Trouvez l'Commande par son ID
        const order = await orderModel.findById(req.body.id);

        if (order) {
            // Supprimez l'Commande de la base de données
            await orderModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Commande supprimée" });
        } else {
            res.status(404).json({ success: false, message: "Commande non trouvée" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de la suppression de la commande", error: error.message });
    }
};


export { listOrders, placeOrder, removeOrder, updateStatus, userOrders };

