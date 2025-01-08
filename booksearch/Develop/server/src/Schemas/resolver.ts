import { signToken } from '../services/auth';
import User from '../models/User';

export const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      const user = await User.findById(context.user._id);
      return user;
    },
  },
  Mutation: {
    login: async (_parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent, { authors, description, title, bookId, image, link }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (_parent, { bookId }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};