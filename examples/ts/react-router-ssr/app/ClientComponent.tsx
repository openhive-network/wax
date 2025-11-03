"use client";

import { createHiveChain } from "@hiveio/wax";
import { useEffect, useState } from "react";

export default function ClientComponent() {
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createHiveChain()
      .then(chain => {
        const chainVersion = chain.getVersion();
        setVersion(chainVersion);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load Hive chain");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!version) {
    return <div>Loading...</div>;
  }

  return <div id="version-client">{version}</div>;
}
