"use client";

import Button from "components/button";
import { useState } from "react";
import {
  Candidate,
  candidateAttach,
  candidateCreate,
  candidateFill,
} from "utils/candidates";
import {
  membersWithUserProfileList,
  MemberWithUserProfile,
} from "utils/members-with-user-profiles";

export default function Page() {
  const [apiKey, setApiKey] = useState("");
  const [members, setMembers] = useState<Array<MemberWithUserProfile> | null>(
    null
  );
  const [member_id, setMemberId] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="p-4 flex gap-4 items-center flex-shrink-0">
        <h1 className="text-xl">CV-Transformer External Usage Example</h1>
        <a
          className="ml-auto px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          href="https://github.com/wouterraateland/cv-transformer-external-example"
          target="_blank"
        >
          Source code
        </a>
      </div>
      <div className="min-h-0 flex flex-grow divide-x border-t">
        <div className="p-4 w-1/2 flex flex-col gap-4">
          <label className="flex items-center gap-4">
            API Key:{" "}
            <input
              className="flex-grow border bg-neutral-100 rounded px-4 py-2"
              onChange={(event) => setApiKey(event.target.value)}
              value={apiKey}
            />
          </label>
          <Button
            onClick={async () => {
              setMembers(await membersWithUserProfileList(apiKey));
            }}
          >
            Load members
          </Button>
          {members && (
            <div>
              <p>Members:</p>
              {members.map((member) => (
                <label key={member.id} className="flex items-center gap-4">
                  <input
                    checked={member_id === member.id}
                    onChange={() =>
                      setMemberId((id) => (id === member.id ? null : member.id))
                    }
                    type="radio"
                  />
                  {member.user_profile.name}
                </label>
              ))}
            </div>
          )}
          {member_id && (
            <Button
              onClick={async () => {
                setCandidate(
                  await candidateCreate(apiKey, {
                    member_id,
                    values: { some_key: "some_value" },
                  })
                );
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
          {candidate &&
            Object.values(candidate.attachments).some(
              (attachment) => attachment.text
            ) && (
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
          <p>Candidate data preview</p>
          <pre>{JSON.stringify(candidate, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
