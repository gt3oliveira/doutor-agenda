import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/lib/auth";

import { SignOutButton } from "./components/sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  return (
    <div>
      <h1>DashboardPage</h1>
      <span>{session.user.name}</span>
      <SignOutButton />
    </div>
  );
}
