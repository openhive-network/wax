import type { TPublicKey } from "../../interfaces";

export interface ApiWitness {
  id: number;
  owner: string;
  created: string;
  signing_key: TPublicKey;
  total_missed: number;
  last_confirmed_block_num: number;
  runningVersion: string;
};

