// Real API for attendance functionality

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SickLeaveRequest {
  start_date: string;
  end_date: string;
  reason: string;
}

interface AttendanceRecord {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
}

export const attendanceApi = {
  async submitSickLeave(data: SickLeaveRequest): Promise<{ success: boolean; message: string; request_id?: number }> {
    try {
      // For now, skip token validation since backend uses placeholder auth
      const response = await fetch(`${API_BASE_URL}/attendance/sick-leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          start_date: data.start_date,
          end_date: data.end_date,
          reason: data.reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit sick leave request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting sick leave:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit sick leave request'
      };
    }
  },

  async getSickLeaveHistory(): Promise<AttendanceRecord[]> {
    try {
      // For now, skip token validation since backend uses placeholder auth
      const response = await fetch(`${API_BASE_URL}/attendance/sick-leave/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch sick leave history');
      }

      const data = await response.json();
      
      // Transform the data to match the expected format
      return data.map((record: any) => ({
        id: record.id.toString(),
        startDate: record.start_date,
        endDate: record.end_date,
        reason: record.reason,
        status: record.status,
        submitted_at: record.submitted_at
      }));
    } catch (error) {
      console.error('Error fetching sick leave history:', error);
      return [];
    }
  },

  async getPendingSickLeaveRequests(): Promise<any[]> {
    try {
      // For now, skip token validation since backend uses placeholder auth
      const response = await fetch(`${API_BASE_URL}/attendance/sick-leave/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch pending requests');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  },

  async approveSickLeaveRequest(requestId: number, status: 'approved' | 'rejected'): Promise<{ success: boolean; message: string }> {
    try {
      // For now, skip token validation since backend uses placeholder auth
      const response = await fetch(`${API_BASE_URL}/attendance/sick-leave/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request_id: requestId,
          status: status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing sick leave request:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process request'
      };
    }
  }
};
