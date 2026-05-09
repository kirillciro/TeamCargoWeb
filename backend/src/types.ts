// Public user shape returned to the frontend.
// Sensitive fields like password_hash are intentionally excluded.
export type SafeUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  provider: string;
  createdAt: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  licenseFrontUrl: string | null;
  licenseBackUrl: string | null;
  passportFrontUrl: string | null;
  passportBackUrl: string | null;
};

// Minimal JWT payload required to identify the logged-in user.
export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};
