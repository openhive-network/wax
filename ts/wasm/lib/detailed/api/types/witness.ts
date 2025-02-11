import { IsDateString, IsNumber, IsString, Validate } from "class-validator";
import { IsPublicKey } from "../../decorators/is_public_key";
import { TPublicKey } from "@hiveio/beekeeper";

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

