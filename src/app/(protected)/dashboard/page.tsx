import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/lib/auth";

import { SignOutButton } from "./_components/sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.clinic) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>DashboardPage</h1>
      <span>{session.user.name}</span>
      <Image
        src={session.user.image as string}
        alt={session.user.name}
        width={50}
        height={50}
        className="rounded-full"
      />
      <SignOutButton />
    </div>
  );
}
