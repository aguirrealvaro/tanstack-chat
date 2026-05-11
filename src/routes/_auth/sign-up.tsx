import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up")({ component: SignUpPage });

function SignUpPage() {
  return <SignUp routing="path" path="/sign-up" />;
}
