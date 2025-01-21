import type { Request, Response } from 'express';
// import user model
import User from '../models/User.js';
// import sign token function from auth
import { signToken } from '../services/auth.js';

// get a single user by either their id or their username
export const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundUser = await User.findOne({
      $or: [{ _id: req.user ? req.user._id : req.params.id }, { username: req.params.username }],
    });

    if (!foundUser) {
      res.status(400).json({ message: 'Cannot find a user with this id!' });
      return;
    }

    res.json(foundUser);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);

    if (!user) {
      res.status(400).json({ message: 'Something is wrong!' });
      return;
    }
    const token = signToken(user.username, user.password, user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (!user) {
      res.status(400).json({ message: "Can't find this user" });
      return;
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      res.status(400).json({ message: 'Wrong password!' });
      return;
    }
    const token = signToken(user.username, user.password, user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { savedBooks: req.body } },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// remove a book from `savedBooks`
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { savedBooks: { bookId: req.params.bookId } } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};