const httpError = require("../utils/HttpError");
const bycryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const controlWrapper = require("../utils/ControlWrapper");
const { User } = require("../models/users");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in use");
  }

  const cryptedPassword = bycryptjs.hashSync(password, 10);
  const newUser = await User.create({ ...req.body, password: cryptedPassword });
  if (!newUser) {
    throw httpError(404, "Not found");
  }

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const loginUser = await User.findOne({ email });
  if (!loginUser) {
    throw httpError(401, "Email or password is wrong");
  }
  const comparePassword = await bycryptjs.compare(password, loginUser.password);
  if (!comparePassword) {
    throw httpError(401, "Email or password is wrong");
  }

  const payload = {
    id: loginUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  try {
    const { payload } = jwt.verify(token, SECRET_KEY);
    await User.findByIdAndUpdate(loginUser._id, { token });
    res.json({
      token,
      user: {
        email: loginUser.email,
        subscription: "starter",
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

const logout = async (req, res, next) => {
  const { _id, email, subscription } = req.user;
  console.log(req.user);
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    email,
    subscription,
  });
};

const current = (req, res, next) => {
  const { email, name } = req.user;

  res.json({
    email,
    name,
  });
};

const changeSubscription = async (req, res, next) => {
  const subscriptionTypes = ["starter", "pro", "business"];
  const { _id } = req.user;
  const subscription = req.body;

  if (!subscriptionTypes.includes(subscription)) {
    next(httpError(400, "No such subscription type"));
  }

  await User.findByIdAndUpdate(_id, subscription);
  next();
};

module.exports = {
  register: controlWrapper(register),
  login: controlWrapper(login),
  logout: controlWrapper(logout),
  current: controlWrapper(current),
  changeSubscription: controlWrapper(changeSubscription),
};
