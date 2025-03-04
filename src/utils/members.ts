enum Role {
  Admin = "admin",
  Superuser = "superuser",
}

export type Member = {
  organization_id: string;
  user_id: string;

  created_at: string;
  id: string;
  values: Record<
    string,
    string | { start: string; end: string } | number | null
  >;
  role: Role;
  updated_at: string;
};
