const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_SECRET='secretmessageverysecret'
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const userCtrl = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, location,locationDetail } = req.body;
      if (password.length < 6)
        return res.status(400).json({ msg: "Password Too Short." });
      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid Email." });
      const user = await Users.findOne({ email: email });
      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name: name,
        email: email,
        password: passwordHash,
        location: location,
        locationDetail: locationDetail,
      });
      await newUser.save();

      res.json({msg: "Sign up Success"})
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });
      //Token Create
      const payload = { id: user._id, name: user.name };
      const token = jwt.sign(payload, TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.json({ token });

      res.json({ msg: "Login a user" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  verifiedToken: (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.send(false);
      jwt.verify(token, TOKEN_SECRET, async (err, verified) => {
        if (err) return res.send(false);
        const user = await Users.findById(verified.id);
        if (!user) return res.send(false);
        return res.send(true);
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userCtrl;
