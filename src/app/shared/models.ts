export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  bio: string;
  skills: string[];
  rating_avg?: number;
  completed_jobs?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'in_progress' | 'completed';
  owner_id?: number;
  freelancer_id?: number | null;
  owner?: User;
  freelancer?: User | null;
  created_at?: string;
}

export interface Proposal {
  id: number;
  job_id: number;
  freelancer_id?: number;
  price: number;
  cover_letter?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  freelancer?: User;
  created_at?: string;
}

export interface Review {
  id?: number;
  job_id: number;
  reviewer_id?: number;
  target_id: number;
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface PlatformStats {
  total_users: number;
  active_jobs: number;
  total_value_moved: number;
}
