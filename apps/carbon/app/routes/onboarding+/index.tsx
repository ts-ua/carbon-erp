import { redirect } from "@remix-run/node";
import { onboardingSequence } from "~/utils/path";

export async function loader() {
  return redirect(onboardingSequence[0]);
}
