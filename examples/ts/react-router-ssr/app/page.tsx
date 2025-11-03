import { createHiveChain } from "@hiveio/wax";
import ClientComponent from "./ClientComponent";

export default async function Home() {
  const version = (await createHiveChain()).getVersion();

  console.log(version);

  // This will not run if something fails with SSR loading of wax
  return <div>
    <div id="version">{version}</div>
    <ClientComponent />
  </div>;
}
