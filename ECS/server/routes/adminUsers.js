const express = require("express");
const router = express.Router();
const AdminUser = require("../models/adminUser");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const adminUser = await AdminUser.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (adminUser) {
    const token = jwt.sign(
      {
        name: adminUser.name,
        email: adminUser.email,
      },
      "secret123"
    );
    res.json({ user: token });
  } else {
    res.json({ user: false });
  }
});

module.exports = router;
