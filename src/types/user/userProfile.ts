export interface UserProfile {
  id: string;
  fullName: string;
  bio: string | null;
  batchYear: number | null;
  jnvId: string | null;
  profileImageUrl: string | null;
  profession: string | null;
  organization: string | null;
  jobTitle: string | null;
  currentCity: string | null;
  currentState: string | null;
  country: string | null;
  skills: string[];
  interests: string[];
  profileCompleteness: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdateRequest {
  fullName: string;
  bio: string | null;
  batchYear: number | null;
  jnvId: string | null;
  profileImageUrl: string | null;
  profession: string | null;
  organization: string | null;
  jobTitle: string | null;
  currentCity: string | null;
  currentState: string | null;
  country: string | null;
}
