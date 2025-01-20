// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';

interface UserToken {
  name: string;
  exp: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return jwtDecode(this.getToken() || '');
  }

  // get token from local storage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } 
      
      return false;
    } catch (err) {
      return false;
    }
  }

  // login method
  static login(username: string, password: string): Promise<any> {
    // Implementation of login method
    return new Promise((resolve, reject) => {
      // Simulate an API call
      if (username === 'user' && password === 'pass') {
        resolve({ success: true });
      } else {
        reject({ success: false });
      }
    });
  }

  // other methods...
}

// Define the signToken function
function signToken(user: { _id: string }) {
  const secret = 'bruh';
  const expiration = '2h';

  return jwt.sign({ data: user }, secret, { expiresIn: expiration });
}

// Export the signToken function
export { signToken };

// Export the AuthService class
export default AuthService;