export interface Interest {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Membership {
  organization: Organization;
}

export interface Student {
  photo?: string;
  phone_number?: string;
  birthday?: string;
  interests: Interest[];
  memberships: Membership[];
  bio?: string;
  location?: string;
  education?: string;
  current_position?: string;
}

export interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  student: Student;
}

export interface EditForm {
  photo: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  bio: string;
  birthday: string;
}
