const bycryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const path = require("path");
const jimp = require('jimp');
const gravatar = require("gravatar");
const sgMail = require('@sendgrid/mail');
const controlWrapper = require("../utils/ControlWrapper");
const httpError = require("../utils/HttpError");
const { User } = require("../models/users");
const { SECRET_KEY, SENDGRID_API_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../','public','avatars');
sgMail.setApiKey(SENDGRID_API_KEY);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const avatarURL = gravatar.url(email);
  if (user) {
    throw httpError(409, "Email in use");
  }

  const verificationToken = nanoid();
  const cryptedPassword = bycryptjs.hashSync(password, 10);
  const newUser = await User.create({ ...req.body, password: cryptedPassword, avatarURL, verificationToken});
  if (!newUser) {
    throw httpError(404, "Not found");
  }

  const emailSend = {
    to: email,
    from: 'hellowhynot1@gmail.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to confirm registration</a>`,
  };

  await sgMail.send(emailSend);

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
  if(!loginUser.verify){
    throw httpError(401, "Please confirm verification");
  }

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

const changeAvatar = async (req,res,next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const newFileName = `${_id}_${originalname}`;
  
  const resultUpload = path.join(avatarsDir, newFileName);
  const avatarURL = path.join('avatars', newFileName);
  console.log(tempUpload)

  jimp.read(tempUpload, function (err, test) {
    if (err) throw err;
    test.resize(250, 250)              
         .write(resultUpload); 
  })
  await User.findByIdAndUpdate(_id, {avatarURL});

  res.status(200).json({
    avatarURL
  })
}

const userVerificationToken = async (req,res,next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({verificationToken});

  if(!user){
    throw httpError(404);
  }

  await User.findByIdAndUpdate(user._id, {verificationToken: null, verify : true})
  
  res.status(200).json({
    message: "Verification successful" 
  })
}

const userVerification = async (req,res,next) => {
  const { email } = req.body;

  if(!email){
    throw httpError(400, "missing required field email");
  }

  const user = await User.findOne({email});
  if(user.verify){
    throw httpError(400, "Verification has already been passed");
  }

  const verificationToken = nanoid();
  await User.findByIdAndUpdate(user._id, {verificationToken});

  const emailSend = {
    to: email,
    from: 'hellowhynot1@gmail.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to confirm registration</a>`,
  };

  await sgMail.send(emailSend);

  res.status(200).json({
    message: "Verification email sent"
  })
}

module.exports = {
  register: controlWrapper(register),
  login: controlWrapper(login),
  logout: controlWrapper(logout),
  current: controlWrapper(current),
  changeSubscription: controlWrapper(changeSubscription),
  changeAvatar: controlWrapper(changeAvatar),
  userVerification: controlWrapper(userVerification),
  userVerificationToken: controlWrapper(userVerificationToken),
};


