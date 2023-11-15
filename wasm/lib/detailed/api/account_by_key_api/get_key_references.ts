import { TPublicKey } from "@hive/beekeeper";
import { IsString, Validate } from "class-validator";

import { IsPublicKey } from "../../decorators/is_public_key.js";

export class GetKeyReferencesRequest {
  @Validate(IsPublicKey, { each: true })
  public keys!: Array<TPublicKey>;
}

export class GetKeyReferencesResponse {
  @Validate(IsString.bind({ each: true }), { each: true })
  public accounts!: Array<Array<string>>;
}
