import { Button } from "~/components/ui/button";
import { getAurinkoAuthorizationUrl } from "~/lib/aurinko";
import { api, HydrateClient } from "~/trpc/server";
import LinkAccount from "./_components/linkAccount";

export default async function Home() {
  return (
    <>
    <LinkAccount />
    </>
  );
}
