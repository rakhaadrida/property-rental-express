const Bank = require("../../models/bank.model");
const fs = require("fs/promises");
const path = require("path");

module.exports = {
    bank: async (req, res) => {
        try {
            const bank = await Bank.find();

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/bank/bank", {
                title: "Isakha Rentals | Bank",
                bank,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/banks");
        }
    },

    createBank: async (req, res) => {
        try {
            const { name, accountNumber, accountName } = req.body;
            await Bank.create({
                name,
                accountNumber,
                accountName,
                logo: `images/${req.file.filename}`,
            });

            req.flash("alertMessage", "Success Add Bank");
            req.flash("alertStatus", "success");

            res.redirect("/admin/banks");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/banks");
        }
    },

    updateBank: async (req, res) => {
        try {
            const { name, accountNumber, accountName } = req.body;
            const bank = await Bank.findById(req.params.id);
            const oldLogo = bank.logo;

            if (!bank) {
                req.flash("alertMessage", "Bank not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/banks");
            }

            if (req.file) {
                bank.logo = `images/${req.file.filename}`;
            }

            bank.name = name;
            bank.accountNumber = accountNumber;
            bank.accountName = accountName;

            await bank.save();

            if (req.file && oldLogo) {
                try {
                    const oldLogoPath = path.join("public", oldLogo);
                    await fs.unlink(oldLogoPath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            req.flash("alertMessage", "Success Update Bank");
            req.flash("alertStatus", "success");

            res.redirect("/admin/banks");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/banks");
        }
    },

    deleteBank: async (req, res) => {
        try {
            const bank = await Bank.findById(req.params.id);

            if (!bank) {
                req.flash("alertMessage", "Bank not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/banks");
            }

            if (bank.logo) {
                try {
                    const logoPath = path.join("public", bank.logo);
                    await fs.unlink(logoPath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            await bank.deleteOne();

            req.flash("alertMessage", "Success Delete Bank");
            req.flash("alertStatus", "success");

            res.redirect("/admin/banks");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/banks");
        }
    },
};
