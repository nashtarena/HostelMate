const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    mustChangePassword?: boolean;
  };
}

export interface StudentPayload {
  name: string;
  email: string;
  rollNumber: string;
  course?: string;
  year?: number;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  block?: string;
  room?: string;
}

export interface ParentPayload {
  name: string;
  email: string;
  phone?: string;
  relation?: string;
  studentId: string;
}

// ── Service ───────────────────────────────────────────────────────────────────

class ApiService {
  private request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}${endpoint}`;
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data as T;
    });
  }

  // Auth
  login(credentials: LoginRequest) {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  getMe() {
    return this.request<{ success: boolean; user: any }>('/api/auth/me');
  }

  // ── Admin: Students ───────────────────────────────────────────────────────

  getStudents() { return this.request<any>('/api/admin/students'); }

  createStudent(data: StudentPayload) {
    return this.request<any>('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateStudent(id: string, data: Partial<StudentPayload>) {
    return this.request<any>(`/api/admin/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteStudent(id: string) {
    return this.request<any>(`/api/admin/students/${id}`, { method: 'DELETE' });
  }

  resetStudentPassword(id: string) {
    return this.request<any>(`/api/admin/students/${id}/reset-password`, { method: 'POST' });
  }

  // ── Admin: Parents ────────────────────────────────────────────────────────

  getParents() { return this.request<any>('/api/admin/parents'); }

  createParent(data: ParentPayload) {
    return this.request<any>('/api/admin/parents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateParent(id: string, data: Partial<Omit<ParentPayload, 'studentId'>>) {
    return this.request<any>(`/api/admin/parents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteParent(id: string) {
    return this.request<any>(`/api/admin/parents/${id}`, { method: 'DELETE' });
  }

  resetParentPassword(id: string) {
    return this.request<any>(`/api/admin/parents/${id}/reset-password`, { method: 'POST' });
  }

  // ── Rooms ─────────────────────────────────────────────────────────────────

  getMyRoom() { return this.request<any>('/api/rooms/my'); }
  getAllRooms() { return this.request<any>('/api/rooms'); }
  getRoomById(id: string) { return this.request<any>(`/api/rooms/${id}`); }
  createRoom(data: any) { return this.request<any>('/api/rooms', { method: 'POST', body: JSON.stringify(data) }); }
  updateRoom(id: string, data: any) { return this.request<any>(`/api/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  assignStudent(id: string, data: any) { return this.request<any>(`/api/rooms/${id}/assign`, { method: 'PATCH', body: JSON.stringify(data) }); }

  // ── Complaints ────────────────────────────────────────────────────────────

  getComplaints() { return this.request<any>('/api/complaints'); }
  createComplaint(data: any) { return this.request<any>('/api/complaints', { method: 'POST', body: JSON.stringify(data) }); }
  updateComplaintStatus(id: string, data: any) { return this.request<any>(`/api/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }); }
  toggleComplaintVote(id: string) { return this.request<any>(`/api/complaints/${id}/vote`, { method: 'POST' }); }

  // ── Leaves ────────────────────────────────────────────────────────────────

  getLeaves() { return this.request<any>('/api/leaves'); }
  applyLeave(data: any) { return this.request<any>('/api/leaves', { method: 'POST', body: JSON.stringify(data) }); }
  approveLeave(id: string) { return this.request<any>(`/api/leaves/${id}/approve`, { method: 'PATCH' }); }
  rejectLeave(id: string) { return this.request<any>(`/api/leaves/${id}/reject`, { method: 'PATCH' }); }

  // ── Fees ──────────────────────────────────────────────────────────────────

  getMyFeeSummary() { return this.request<any>('/api/fees/summary'); }
  getAdminFeeSummary() { return this.request<any>('/api/fees/summary/admin'); }
  getFees() { return this.request<any>('/api/fees'); }
  createFee(data: any) { return this.request<any>('/api/fees', { method: 'POST', body: JSON.stringify(data) }); }
  payFee(id: string) { return this.request<any>(`/api/fees/${id}/pay`, { method: 'PATCH' }); }

  // ── Mess ──────────────────────────────────────────────────────────────────

  getWeekMenu() { return this.request<any>('/api/mess/menu/week'); }
  getMenu() { return this.request<any>('/api/mess/menu'); }
  createMenu(data: any) { return this.request<any>('/api/mess/menu', { method: 'POST', body: JSON.stringify(data) }); }
  updateMenu(id: string, data: any) { return this.request<any>(`/api/mess/menu/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  submitFeedback(data: any) { return this.request<any>('/api/mess/feedback', { method: 'POST', body: JSON.stringify(data) }); }
  getRatingTrends() { return this.request<any>('/api/mess/feedback/ratings'); }

  // ── Visitors ──────────────────────────────────────────────────────────────

  getVisitors() { return this.request<any>('/api/visitors'); }
  addVisitor(data: any) { return this.request<any>('/api/visitors', { method: 'POST', body: JSON.stringify(data) }); }
  checkInVisitor(id: string) { return this.request<any>(`/api/visitors/${id}/checkin`, { method: 'PATCH' }); }
  checkOutVisitor(id: string) { return this.request<any>(`/api/visitors/${id}/checkout`, { method: 'PATCH' }); }

  // ── Expenses ──────────────────────────────────────────────────────────────

  getMyBalance() { return this.request<any>('/api/expenses/balance'); }
  getExpenses() { return this.request<any>('/api/expenses'); }
  createExpense(data: any) { return this.request<any>('/api/expenses', { method: 'POST', body: JSON.stringify(data) }); }
  settleExpense(id: string) { return this.request<any>(`/api/expenses/${id}/settle`, { method: 'PATCH' }); }

  // ── Notices ───────────────────────────────────────────────────────────────

  getNotices() { return this.request<any>('/api/notices'); }
  createNotice(data: any) { return this.request<any>('/api/notices', { method: 'POST', body: JSON.stringify(data) }); }
  updateNotice(id: string, data: any) { return this.request<any>(`/api/notices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  deleteNotice(id: string) { return this.request<any>(`/api/notices/${id}`, { method: 'DELETE' }); }

  // ── Roommate ──────────────────────────────────────────────────────────────

  getMyPreferences() { return this.request<any>('/api/roommate/preferences'); }
  savePreferences(data: any) { return this.request<any>('/api/roommate/preferences', { method: 'PUT', body: JSON.stringify(data) }); }
  getMatches() { return this.request<any>('/api/roommate/matches'); }

  // ── Admin: Stats ──────────────────────────────────────────────────────────

  getDashboardStats() { return this.request<any>('/api/admin/stats'); }
}

export const apiService = new ApiService();
