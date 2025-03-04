import type { TPublicKey } from "../../interfaces";

export interface ApiWitness {
  id: number;
  owner: string;
  created: string;
  signing_key: TPublicKey;
};

