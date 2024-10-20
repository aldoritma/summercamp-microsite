import { redirect } from "@remix-run/server-runtime";

export const loader = () => {
  return redirect("/en/pages/summer-camp-2025");
}

