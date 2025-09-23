"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const SignOutButton = () => {
  const route = useRouter();

  const handleSignOut = async () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          route.push("/authentication");
        },
      },
    });
  };

  return <Button onClick={handleSignOut}>Sair</Button>;
};
