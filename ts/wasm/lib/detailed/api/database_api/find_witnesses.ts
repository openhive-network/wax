import type { ApiWitness } from "../types/index.js";

export interface FindWitnessesRequest {
  owners: string[];
  delayed_votes_active: boolean;
}

export interface FindWitnessesResponse {
  witnesses: Array<ApiWitness>;
}
