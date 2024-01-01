const { validationResult } = require("express-validator");

const HttpError = require("../models/HttpError");
const User = require("../models/user");

const DummyUsers = [
  {
    id: "u1",
    name: "Mario George",
    email: "mario@mario.com",
    password: "testpassword",
  },
];
const getAllUsers = async (req, res, next) => {
  let allUsers;
  try {
    // -password means the field will not be returned with the doc js object only you can use "email name" to only return those fields

    allUsers = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Getting users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((user) => user.toObject({ getters: true })),
  });
};
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input please check your data", 422));
  }
  const { email, password, name, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  const createdUser = new User({
    email: email,
    password: password,
    name: name,
    places,
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.cdgdbentre.edu.vn%2Frandom-anime-character-qbx135oe%2F&psig=AOvVaw1ciu2tyNyfhJBew5LB-gTZ&ust=1704191831767000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCLjbj7n_u4MDFQAAAAAdAAAAABAJ",
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let loggedInUser;

  try {
    loggedInUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!loggedInUser || loggedInUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    // 401 status code means auth failed
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getAllUsers = getAllUsers;
exports.login = login;
exports.signup = signup;

/* 

in mongoose 

.find

find by any property of the document object . it will always return an array even if it is only one document

.findOne

return the first element that satisfies the property value

.findById 

takes the _id property of the document object and returns the whole document object

*/
