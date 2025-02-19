import { apiBaseUrl } from "utils/api";

export type Organization = {
  default_layout_id: string | null;
  id: string;
  name: string;
};

export const organizationsList = async (
  apiKey: string
): Promise<Array<Organization>> => {
  const response = await fetch(`${apiBaseUrl}/organizations`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
