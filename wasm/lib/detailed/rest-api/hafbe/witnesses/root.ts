import { IsString } from "class-validator";

export class GetWitnessesRoot {
  @IsString()
  public accountName!: string;
}

export class GetWitnessesRootResponse {
  @IsString()
  public witness!: string;
}
