import React from "react";
import { auth, signOut } from "@/auth";
// For client components
import { useSession } from "next-auth/react";

export default async function SettingsPage() {
  const session = await auth();
  // For client components
  // const session = useSession(); OR this custom hook use-current-user.ts
  // We need to add the
  // const session = await auth();
  // <SessionProvider session={session}> to the layout file

  return (
    <div className="bg-white p-10 rounded-xl">
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
