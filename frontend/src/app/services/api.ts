const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginRequest {
  email: string;
  password: string;
  role: 'student' | 'warden' | 'admin';
}

interface RegisterRequest {
  fullName: string;
  rollNumber: string;
  email: string;
  password: string;
  course: string;
  year: number;
  phone: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    fullName?: string;
  };
}

class ApiService {
  private getBaseUrl(): string {
    return API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Rooms
  async getMyRoom() {
    return this.request('/api/rooms/my');
  }

  async getAllRooms() {
    return this.request('/api/rooms');
  }

  async getRoomById(id: string) {
    return this.request(`/api/rooms/${id}`);
  }

  async createRoom(roomData: any) {
    return this.request('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async updateRoom(id: string, roomData: any) {
    return this.request(`/api/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(roomData),
    });
  }

  async assignStudent(id: string, studentData: any) {
    return this.request(`/api/rooms/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(studentData),
    });
  }

  // Complaints
  async getComplaints() {
    return this.request('/api/complaints');
  }

  async createComplaint(complaintData: any) {
    return this.request('/api/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }

  async updateComplaintStatus(id: string, statusData: any) {
    return this.request(`/api/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async toggleComplaintVote(id: string) {
    return this.request(`/api/complaints/${id}/vote`, {
      method: 'POST',
    });
  }

  // Leaves
  async getLeaves() {
    return this.request('/api/leaves');
  }

  async applyLeave(leaveData: any) {
    return this.request('/api/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async approveLeave(id: string) {
    return this.request(`/api/leaves/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectLeave(id: string) {
    return this.request(`/api/leaves/${id}/reject`, {
      method: 'PATCH',
    });
  }

  // Fees
  async getMyFeeSummary() {
    return this.request('/api/fees/summary');
  }

  async getAdminFeeSummary() {
    return this.request('/api/fees/summary/admin');
  }

  async getFees() {
    return this.request('/api/fees');
  }

  async createFee(feeData: any) {
    return this.request('/api/fees', {
      method: 'POST',
      body: JSON.stringify(feeData),
    });
  }

  async payFee(id: string) {
    return this.request(`/api/fees/${id}/pay`, {
      method: 'PATCH',
    });
  }

  // Mess
  async getWeekMenu() {
    return this.request('/api/mess/menu/week');
  }

  async getMenu() {
    return this.request('/api/mess/menu');
  }

  async createMenu(menuData: any) {
    return this.request('/api/mess/menu', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  }

  async updateMenu(id: string, menuData: any) {
    return this.request(`/api/mess/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(menuData),
    });
  }

  async submitFeedback(feedbackData: any) {
    return this.request('/api/mess/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getRatingTrends() {
    return this.request('/api/mess/feedback/ratings');
  }

  // Visitors
  async getVisitors() {
    return this.request('/api/visitors');
  }

  async addVisitor(visitorData: any) {
    return this.request('/api/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });
  }

  async checkInVisitor(id: string) {
    return this.request(`/api/visitors/${id}/checkin`, {
      method: 'PATCH',
    });
  }

  async checkOutVisitor(id: string) {
    return this.request(`/api/visitors/${id}/checkout`, {
      method: 'PATCH',
    });
  }

  // Expenses
  async getMyBalance() {
    return this.request('/api/expenses/balance');
  }

  async getExpenses() {
    return this.request('/api/expenses');
  }

  async createExpense(expenseData: any) {
    return this.request('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async settleExpense(id: string) {
    return this.request(`/api/expenses/${id}/settle`, {
      method: 'PATCH',
    });
  }

  // Notices
  async getNotices() {
    return this.request('/api/notices');
  }

  async createNotice(noticeData: any) {
    return this.request('/api/notices', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
  }

  async updateNotice(id: string, noticeData: any) {
    return this.request(`/api/notices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(noticeData),
    });
  }

  async deleteNotice(id: string) {
    return this.request(`/api/notices/${id}`, {
      method: 'DELETE',
    });
  }

  // Roommate
  async getMyPreferences() {
    return this.request('/api/roommate/preferences');
  }

  async savePreferences(prefsData: any) {
    return this.request('/api/roommate/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefsData),
    });
  }

  async getMatches() {
    return this.request('/api/roommate/matches');
  }

  // Admin
  async getDashboardStats() {
    return this.request('/api/admin/stats');
  }
}

export const apiService = new ApiService();
