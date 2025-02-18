"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { getAurinkoAuthorizationUrl } from "~/lib/aurinko";
import { useClerk } from "@clerk/nextjs";

export default function LinkAccount() {
  const { signOut } = useClerk();
  return (
    <>
      <Button
        onClick={async () => {
          const authUrl = await getAurinkoAuthorizationUrl("Google");
          window.location.href = authUrl;
        }}
      >
        Link Account
      </Button>

      <Button
        onClick={() => {
          console.log("signing..........");
          signOut({ redirectUrl: "/" });
          console.log("done");
        }}
        className="rounded bg-red-500 p-2 text-white"
      >
        Logout
      </Button>
    </>
  );
}
