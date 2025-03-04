import { apiBaseUrl } from "utils/api";
import { Member } from "utils/members";
import { UserProfile } from "utils/user-profiles";

export type MemberWithUserProfile = Member & { user_profile: UserProfile };

export const membersWithUserProfileList = async (
  apiKey: string
): Promise<Array<MemberWithUserProfile>> => {
  const response = await fetch(
    `${apiBaseUrl}/members?select=*,user_profile:user_profiles!inner(*)`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
