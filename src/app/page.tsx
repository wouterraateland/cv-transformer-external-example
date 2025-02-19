"use client";

import clsx from "clsx";
import { ComponentProps, useState } from "react";

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

type Candidate = {
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

type Organization = {
  default_layout_id: string | null;
  id: string;
  name: string;
};

const apiBaseUrl = "https://api.cv-transformer.com/v1";

const organizationsList = async (
  apiKey: string
): Promise<Array<Organization>> => {
  const response = await fetch(`${apiBaseUrl}/organizations`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

const candidateCreate = async (
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

const candidateAttach = async (
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

const candidateFill = async (
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

function Button({
  children,
  className,
  onClick,
  ...props
}: ComponentProps<"button">) {
  const [duration, setDuration] = useState(0);
  return (
    <button
      {...props}
      className={clsx(
        "bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200",
        className
      )}
      onClick={async (event) => {
        const target = event.currentTarget;
        target.disabled = true;
        const start = Date.now();
        setDuration(0);
        const i = setInterval(() => {
          setDuration(Date.now() - start);
        }, 1000);
        try {
          await onClick?.(event);
        } catch (error) {
          alert(error);
        }
        clearInterval(i);
        setDuration(Date.now() - start);
        target.disabled = false;
      }}
    >
      {children}
      {duration > 0 && (
        <span className="ml-2 text-sm text-blue-900">{duration}ms</span>
      )}
    </button>
  );
}

export default function Page() {
  const [apiKey, setApiKey] = useState("");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="p-4 flex-shrink-0">
        <h1 className="text-xl text-center">
          CV-Transformer External Usage Example
        </h1>
      </div>
      <div className="min-h-0 flex flex-grow divide-x border-t">
        <div className="p-4 w-1/2 flex flex-col gap-4">
          <label className="flex items-center">
            API Key:{" "}
            <input
              className="ml-auto border bg-neutral-100 rounded px-4 py-2"
              onChange={(event) => setApiKey(event.target.value)}
              value={apiKey}
            />
          </label>
          <Button
            onClick={async () => {
              const organizations = await organizationsList(apiKey);
              setOrganization(organizations[0] ?? null);
            }}
          >
            Load organization
          </Button>
          {organization && <div>Organization: {organization.name}</div>}
          {organization && (
            <Button
              onClick={async () => {
                setCandidate(await candidateCreate(apiKey, {}));
              }}
            >
              Create new candidate
            </Button>
          )}
          {candidate && (
            <label>
              Upload attachment
              <input
                onChange={async (event) => {
                  const target = event.target;
                  const file = target.files?.[0];
                  if (!file) return;
                  target.disabled = true;
                  try {
                    setCandidate(
                      await candidateAttach(apiKey, candidate.id, file)
                    );
                  } catch (error) {
                    alert(error);
                  }
                  target.disabled = false;
                }}
                type="file"
              />
            </label>
          )}
          {candidate?.cv && (
            <Button
              onClick={async () => {
                setCandidate(await candidateFill(apiKey, candidate.id));
              }}
            >
              Fill candidate data
            </Button>
          )}
          {candidate && Object.values(candidate.values).some(Boolean) && (
            <>
              <p>Results</p>
              <div className="flex gap-4 flex-wrap">
                <a
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  href={`https://cv-transformer.com/proposals/${candidate.id}?language=${candidate.language}&secret=${candidate.secret}`}
                  target="_blank"
                >
                  Weblink
                </a>
                <a
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  href={`https://cv-transformer.com/proposals/${candidate.id}/pdf?language=${candidate.language}&secret=${candidate.secret}`}
                  target="_blank"
                >
                  PDF
                </a>
                <a
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  href={`https://cv-transformer.com/proposals/${candidate.id}?language=${candidate.language}&secret=${candidate.secret_anonymous}`}
                  target="_blank"
                >
                  Weblink (anonymous)
                </a>
                <a
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  href={`https://cv-transformer.com/proposals/${candidate.id}/pdf?language=${candidate.language}&secret=${candidate.secret_anonymous}`}
                  target="_blank"
                >
                  PDF (anonymous)
                </a>
              </div>
            </>
          )}
        </div>
        <div className="p-4 w-1/2 space-y-4">
          <p>Preview</p>
          <pre>{JSON.stringify(candidate, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
