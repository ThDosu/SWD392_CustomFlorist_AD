import { SuccessResponse } from "./utils.type";

export type AuthResponse = SuccessResponse<{
  data: string;
}>;

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string;
}>;
