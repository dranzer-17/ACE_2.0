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

  
  /**
   * Fetches the list of all available menu items.
   */
  getMenu: async () => {
    try {
      const response = await fetch(`${API_URL}/canteen/menu`);
      if (!response.ok) {
        return { success: false, message: 'Failed to fetch menu.' };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Get Menu API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  /**
   * Places a new order.
   * @param orderData The contents of the shopping cart.
   * @param userId The ID of the user placing the order.
   */
  placeOrder: async (orderData: any) => { // <-- SIMPLIFIED: only one argument now
    try {
      const response = await fetch(`${API_URL}/canteen/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- SIMPLIFIED: Just send the orderData object directly ---
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || 'Failed to place order.' };
      }
      return { success: true, message: 'Order placed successfully!', order: data };
    } catch (error) {
      console.error("Place Order API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  /**
   * Fetches all orders that are not yet delivered. (For Admin)
   */
  getAdminOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/canteen/admin/orders`);
      if (!response.ok) {
        return { success: false, message: 'Failed to fetch orders.' };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Get Admin Orders API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  /**
   * Updates the status of a specific order. (For Admin)
   * @param orderId The ID of the order to update.
   * @param newStatus The new status string (e.g., "preparing").
   */
  updateOrderStatus: async (orderId: any, newStatus: any) => {
    try {
      const response = await fetch(`${API_URL}/canteen/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_status: newStatus }),
      });
      if (!response.ok) {
        return { success: false, message: 'Failed to update order status.' };
      }
      return { success: true, message: 'Order status updated!' };
    } catch (error) {
      console.error("Update Order Status API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  /**
   * Creates a new menu item. (For Admin)
   * @param itemData The data for the new menu item.
   */
  createMenuItem: async (itemData: any) => {
    try {
      const response = await fetch(`${API_URL}/canteen/admin/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
       const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || 'Failed to create item.' };
      }
      return { success: true, message: 'Menu item created successfully!' };
    } catch (error) {
      console.error("Create Menu Item API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  /**
   * Updates an existing menu item. (For Admin)
   * @param itemId The ID of the item to update.
   * @param itemData The new data for the menu item.
   */
  updateMenuItem: async (itemId: any, itemData: any) => {
    try {
      const response = await fetch(`${API_URL}/canteen/admin/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || 'Failed to update item.' };
      }
      return { success: true, message: 'Menu item updated successfully!' };
    } catch (error) {
      console.error("Update Menu Item API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

   /**
   * Deletes a menu item. (For Admin)
   * @param itemId The ID of the item to delete.
   */
  deleteMenuItem: async (itemId: any) => {
    try {
      const response = await fetch(`${API_URL}/canteen/admin/menu/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
         // Even with no content, a failed response needs handling
        return { success: false, message: 'Failed to delete item.' };
      }
      return { success: true, message: 'Menu item deleted successfully!' };
    } catch (error) {
      console.error("Delete Menu Item API error:", error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  // --- Courses ---
  getCourses: async () => {
    // Reusing getMenu logic for simplicity
    try {
      const response = await fetch(`${API_URL}/management/courses`);
      if (!response.ok) return { success: false, message: 'Failed to fetch courses.' };
      return { success: true, data: await response.json() };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  createCourse: async (courseData: any) => {
    try {
      const response = await fetch(`${API_URL}/management/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.detail || 'Failed to create course.' };
      return { success: true, message: 'Course created!' };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  
  // --- Classrooms ---
  getClassrooms: async () => {
    try {
      const response = await fetch(`${API_URL}/management/classrooms`);
      if (!response.ok) return { success: false, message: 'Failed to fetch classrooms.' };
      return { success: true, data: await response.json() };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  createClassroom: async (classroomData: any) => {
    try {
      const response = await fetch(`${API_URL}/management/classrooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classroomData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.detail || 'Failed to create classroom.' };
      return { success: true, message: 'Classroom created!' };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  
  // --- Faculty ---
  getFaculty: async () => {
    try {
      const response = await fetch(`${API_URL}/management/faculty`);
      if (!response.ok) return { success: false, message: 'Failed to fetch faculty.' };
      return { success: true, data: await response.json() };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },

  // --- Timetable Slots ---
  getTimetable: async (branch: string, year: number) => {
    try {
      const response = await fetch(`${API_URL}/timetables/${branch}/${year}`);
      if (!response.ok) return { success: false, message: 'Failed to fetch timetable.' };
      return { success: true, data: await response.json() };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  createTimetableSlot: async (slotData: any) => {
    try {
      const response = await fetch(`${API_URL}/timetables/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, message: data.detail || 'Failed to create slot.' };
      return { success: true, message: 'Slot created!' };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  deleteTimetableSlot: async (slotId: number) => {
    try {
      const response = await fetch(`${API_URL}/timetables/${slotId}`, {
        method: 'DELETE',
      });
      if (!response.ok) return { success: false, message: 'Failed to delete slot.' };
      return { success: true, message: 'Slot deleted!' };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },

  // --- Student Timetable ---
  getMyTimetable: async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/timetables/my-schedule/${userId}`);
      if (!response.ok) return { success: false, message: 'Failed to fetch schedule.' };
      return { success: true, data: await response.json() };
    } catch (error) {
      return { success: false, message: 'An error occurred.' };
    }
  },
  submitFeedback: async (feedbackData: any) => {
    try {
      const response = await fetch(`${API_URL}/feedback/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.detail || 'Failed to submit feedback.' };
      }
      return { success: true, message: 'Feedback submitted successfully!' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },

  getAdminFeedback: async () => {
    try {
      const response = await fetch(`${API_URL}/feedback/admin`);
      if (!response.ok) {
        return { success: false, message: 'Failed to fetch feedback.' };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }
  },
};