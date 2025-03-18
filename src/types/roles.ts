export const roles = {
  admin: "admin",
  manager: "manager",
} as const;

export const status = {
  pending: "pending",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
} as const;
