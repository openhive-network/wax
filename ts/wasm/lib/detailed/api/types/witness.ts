import { IsDateString, IsNumber, IsString, Validate } from "class-validator";
import { IsPublicKey } from "../../decorators/is_public_key";
import type { TPublicKey } from "../../interfaces";

export class ApiWitness {
  @IsNumber()
  public id!: number;

  @IsString()
  public owner!: string;

  @IsDateString()
  public created!: string;

  @Validate(IsPublicKey)
  public signing_key!: TPublicKey;
};

