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
    return jwtDecode(AuthService.getToken() || '');
  }

  // get token from local storage
  static getToken() {
    return localStorage.getItem('id_token');
  }

  // check if user's logged in
  static loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const isExpired = this.isTokenExpired(token);
      if (isExpired) {
        console.warn("Token is expired");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error checking if token is expired:", err);
      return false;
    }
  }


  // check if token is expired
  static isTokenExpired(token: string) {
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

  static logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    // This will reload the page and reset the state of the application
    window.location.assign('/');
  }
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