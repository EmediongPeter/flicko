import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAcessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const code = params.get("state");
  const _token = params.get("token");
  console.log({code, _token})

  if (!code)
    return NextResponse.json(
      { error: "Account connection failed" },
      { status: 400 },
    );

  const token = await exchangeCodeForAcessToken(code as string);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );

  const accountDetails = await getAccountDetails(token.accessToken);

  await db.account.upsert({
    where: { id: token.accountId.toString() },
    update: { accessToken: token.accessToken },
    create: {
      id: token.accountId.toString(),
      userId,
      accessToken: token.accessToken,
      emailAdress: accountDetails.email,
      name: accountDetails.name,
    },
  });

  return NextResponse.redirect(new URL("/mail", req.url));
};
