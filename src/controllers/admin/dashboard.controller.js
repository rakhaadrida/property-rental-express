module.exports = {
    dashboard: (req, res) => {
        res.render("admin/dashboard/dashboard", {
            title: "Isakha Rentals | Dashboard",
        });
    },
};
