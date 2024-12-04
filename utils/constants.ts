export const Roles = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
  } as const;
  
  export type Role = keyof typeof Roles;  