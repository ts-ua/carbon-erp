import { redirect } from "@remix-run/node";
import { onboardingList } from "~/utils/path";

export async function loader() {
  return redirect(onboardingList[0]);
}
