import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  joinDate: Date;
  email: string;
  phoneNumber: string;
  status: string;
};

export type IUserItem = {
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
};

export type IUserAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  createdAt: Date;
  invoiceNumber: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type IUserOrderStatistics = {
  total_orders: number;
  total_order_value: number;
  returned_orders: number;
  returned_orders_value: number;
};

export type INUserItem = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  profile_icon: string;
  status: string;
  created_at: string;
  order_statistics: IUserOrderStatistics;
};

export type IUserStatus = {
  status: string;
};

export interface UserAddress {
  _id: string
  user_id: string
  full_name: string
  mobile_number: string
  address_line_1: string
  address_line_2: string
  landmark: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  formatted_address: string
  created_at: string
  edited_at: string
}


export interface AddAddress {
  full_name: string
  mobile_number: string
  address_line_1: string
  address_line_2?: string
  landmark?: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}


export interface UserPersonalInfo {
  first_name: string
  last_name: string
  email:string
  mobile_number:string
}

export interface GetUserInfoRes {
  success: boolean
  data: GetUserInfoData
}

export interface GetUserInfoData {
  user: GetUserInfo
}

export interface GetUserInfo {
  id:string
  first_name: string
  last_name: string
  email: string
  mobile_number: string
  profile_icon: string
  is_admin: boolean
  full_name: string
  created_at: string
  edited_at: string
  status:string
}

export interface GetUserInfoKey {
   first_name: string
  last_name: string
  email: string
  mobile_number: string
}