import type { custom_json } from "../protocol";

export enum ESupportedCustomJsonMethods {
  FOLLOW = "follow"
}

interface ITargetData {
  id: ESupportedCustomJsonMethods;
  json: object;
  auths: string[];
}

export class CustomJsonBuilder {
  private target!: ITargetData;

  private constructor() {}

  public static follow(follower: string, following: string, what: string): CustomJsonBuilder {
    const builder = new CustomJsonBuilder();

    builder.target = {
      id: ESupportedCustomJsonMethods.FOLLOW,
      json: [
        "follow",
        {
          follower,
          following,
          what: [ what ]
        }
      ],
      auths: [ follower ]
    };

    return builder;
  }

  public build(): custom_json {
    return {
      id: this.target.id,
      json: JSON.stringify(this.target.json),
      required_auths: [],
      required_posting_auths: this.target.auths
    };
  }
}
