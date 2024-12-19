import { IsDateString, IsNumber, IsString } from "class-validator";

export class ApiWitness {
  @IsNumber()
  public id!: number;

  @IsString()
  public owner!: string;

  @IsDateString()
  public created!: string;

  @IsString()
  public signing_key!: string;
};

