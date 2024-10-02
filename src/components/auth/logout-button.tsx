"use client";

import { logout } from "@/actions/logout";

type LogoutButtonProps = {
  children: React.ReactNode;
};

export default function LogoutButton({ children }: LogoutButtonProps) {
  const onClick = async () => {
    console.log("clicked");
    await logout;
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}
