"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getAurinkoAuthorizationUrl = async (
  serviceType: "Google" | "Office365",
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const params = new URLSearchParams({
    clientId: '1eed94e2f87539f50faab0c5479df466',
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForAcessToken = async (code: string) => {
  console.log('Received some code', {code})
  
  try {
    const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
          auth: {
              username: '1eed94e2f87539f50faab0c5479df466',
              password: 'aykM3TAYa3cSgjt5WRY2QI_seyygYFXXaxpRBUS6FOaCmdp8u6o-MBXbociAWMWPOmBiQIxL40Ct-zpT3Wjggg'
          }
      }
  );

    console.log(response.data)
    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching Aurinko token:", error.response?.data);
    } else {
      console.error("Unexpected error fetching Aurinko token:", error);
    }
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const response = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching account details:", error.response?.data);
    } else {
      console.error("Unexpected error fetching account details:", error);
    }
    throw error;
  }
};
