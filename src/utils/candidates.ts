import { apiBaseUrl } from "utils/api";

type CandidateAttachment = {
  text: string;
  type: "image" | "link" | "pdf";
  url: string;
};

type CandidateValues = Record<
  string,
  | string
  | number
  | null
  | { start: string; end: string }
  | Array<CandidateValues>
>;

export type Candidate = {
  id: string;

  created_at: string;
  creator_id: string | null;
  cv: CandidateAttachment | null;
  language: string;
  layout_id: string | null;
  organization_id: string;
  secret_anonymous: string;
  secret: string;
  status: "pending" | "active";
  updated_at: string;
  vacancy: CandidateAttachment | null;
  values: CandidateValues;
};

export const candidateCreate = async (
  apiKey: string,
  params: { layout_id?: string; values?: CandidateValues }
): Promise<Candidate> => {
  const response = await fetch(`${apiBaseUrl}/candidates`, {
    body: JSON.stringify(params),
    headers: { Authorization: `Bearer ${apiKey}` },
    method: "POST",
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const candidateAttach = async (
  apiKey: string,
  candidate_id: string,
  file: File,
  location: "cv" | "vacancy" = "cv"
): Promise<Candidate> => {
  const response = await fetch(
    `${apiBaseUrl}/candidates/${candidate_id}/attach?location=${location}`,
    {
      body: file,
      headers: { Authorization: `Bearer ${apiKey}` },
      method: "POST",
    }
  );
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const candidateFill = async (
  apiKey: string,
  candidate_id: string
): Promise<Candidate> => {
  const response = await fetch(
    `${apiBaseUrl}/candidates/${candidate_id}/fill`,
    { headers: { Authorization: `Bearer ${apiKey}` }, method: "POST" }
  );
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};
