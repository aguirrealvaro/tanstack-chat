import { ClerkProvider as DefaultClerkProvider } from "@clerk/tanstack-react-start";

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DefaultClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/">
      {children}
    </DefaultClerkProvider>
  );
};
