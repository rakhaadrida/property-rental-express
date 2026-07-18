const Bank = require("../../models/bank.model");

module.exports = {
    bank: async (req, res) => {
        try {
            const banks = await Bank.find();

            res.status(200).json({ data: banks });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
