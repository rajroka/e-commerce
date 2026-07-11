import { model, models, Schema } from 'mongoose';

const addressSchema = new Schema(
  {
    id:         { type: String, required: true },
    label:      { type: String, default: 'Home' },   // Home / Work / Other
    fullName:   { type: String, required: true },
    phone:      { type: String, default: '' },
    line1:      { type: String, required: true },
    line2:      { type: String, default: '' },
    city:       { type: String, required: true },
    state:      { type: String, default: '' },
    postalCode: { type: String, required: true },
    country:    { type: String, required: true },
    isDefault:  { type: Boolean, default: false },
  },
  { _id: false }
);

const notificationSchema = new Schema(
  {
    orderUpdates:    { type: Boolean, default: true },
    promotions:      { type: Boolean, default: false },
    newArrivals:     { type: Boolean, default: false },
    priceDrops:      { type: Boolean, default: true },
    emailEnabled:    { type: Boolean, default: true },
    pushEnabled:     { type: Boolean, default: false },
  },
  { _id: false }
);

const userProfileSchema = new Schema(
  {
    userId:      { type: String, required: true, unique: true, index: true },
    phone:       { type: String, default: '' },
    bio:         { type: String, default: '', maxlength: 300 },
    dateOfBirth: { type: String, default: '' },   // stored as ISO date string
    gender:      { type: String, enum: ['', 'male', 'female', 'other', 'prefer_not'], default: '' },
    addresses:   { type: [addressSchema], default: [] },
    notifications: { type: notificationSchema, default: () => ({}) },
    // Soft-delete support
    deactivated:     { type: Boolean, default: false },
    deactivatedAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

export interface IAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface INotifications {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  priceDrops: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

const UserProfile = models.UserProfile || model('UserProfile', userProfileSchema);
export default UserProfile;
