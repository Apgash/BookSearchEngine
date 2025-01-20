import  User from '../models/User';
// import {signToken} from '../services/auth';
import jwt from 'jsonwebtoken';

interface Context {
  user: {
    _id: string;
  };
}

interface LoginArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface SaveBookArgs {
  authors: string[];
  description: string;
  title: string;
  bookId: string;
  image: string;
  link: string;
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context) => {
      const user = await User.findById(context.user._id);
      return user;
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { authors, description, title, bookId, image, link }: SaveBookArgs, context: Context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: Context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

export { resolvers };
const secret = 'bruh';
const expiration = '2h';

function signToken(username: string, email: string, _id: unknown) {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

