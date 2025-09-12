// Get the backend URL from our environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * A centralized service for making API calls to the backend.
 */
export const apiService = {
  /**
   * Logs a user in by sending their credentials to the backend.
   * @param email The user's email.
   * @param password The user's password.
   * @returns An object with success status, a message, and user data if successful.
   */
  login: async (email: any, password: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // The API returned an error (e.g., 401 Unauthorized)
        return { success: false, message: data.detail || 'Login failed.' };
      }
      
      // Login was successful, return the user data from the backend
      return { success: true, user: data, message: 'Login successful!' };

    } catch (error) {
      console.error("Login API error:", error);
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  },

  /**
   * Signs up a new student.
   * @param studentData An object containing all student details.
   * @returns An object with success status and a message.
   */
  signup: async (studentData: any) => {
    try {
        const response = await fetch(`${API_URL}/auth/signup/student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.detail || 'Signup failed.' };
        }

        return { success: true, message: data.message };

    } catch (error) {
        console.error("Signup API error:", error);
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  },
};