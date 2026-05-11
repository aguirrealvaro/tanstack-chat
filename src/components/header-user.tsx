import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/clerk-react";

export const HeaderUser = () => {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
};
