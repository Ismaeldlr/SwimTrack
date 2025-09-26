import { Redirect } from "expo-router";

export default function Index() {
  // Send the user to the tabs
  return <Redirect href="/tabs/home" />;
}
