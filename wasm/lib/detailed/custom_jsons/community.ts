import { HiveAppsOperation, TAccountName } from './factory.js';

export type TCommunityRules = {
  action: ECommunityOperationActions.FLAG_POST | ECommunityOperationActions.MUTE_POST | ECommunityOperationActions.UNMUTE_POST;
  account: TAccountName;
  permlink: string;
  notes: string;
} | {
  action: ECommunityOperationActions.PIN_POST | ECommunityOperationActions.UNPIN_POST;
  account: TAccountName;
  permlink: string;
} | {
  action: ECommunityOperationActions.SUBSCRIBE | ECommunityOperationActions.UNSUBSCRIBE;
} | {
  action: ECommunityOperationActions.SET_USER_TITLE;
  account: TAccountName;
  title: string;
} | {
  action: ECommunityOperationActions.UPDATE_PROPS;
  props: Readonly<ICommunityProps>;
};

export class CommunityOperationData {
  public constructor(
    public readonly accounts: Array<TAccountName>,
    public readonly community: string,
    public readonly data: TCommunityRules
  ) {}
}

export enum ESupportedLanguages {
  ENGLISH    = "en",
  KOREAN     = "kr",
  CHINESE    = "zh",
  MALAY      = "ms",
  POLISH     = "pl",
  PORTUGUESE = "pt",
  RUSSIAN    = "ru",
  ITALIAN    = "it",
  GERMAN     = "de",
  SPANISH    = "es",
  SWEDISH    = "sv"
}

export interface ICommunityProps {
  /**
   * Community title
   *
   * @type {string}
   */
  title: string;

  /**
   * Community about
   *
   * @default ""
   * @type {string}
   */
  about?: string;

  /**
   * Is Not Safe For Work
   *
   * @default false
   * @type {boolean}
   */
  is_nsfw?: boolean;

  /**
   * Community language
   *
   * @default ESupportedLanguages.ENGLISH
   * @type {ESupportedLanguages}
   */
  lang?: ESupportedLanguages | string;

  /**
   * Community description
   *
   * @default ""
   * @type {string}
   */
  description?: string;

  /**
   * Community rules
   *
   * @default ""
   * @type {string}
   */
  flag_text?: string;
}

export enum ECommunityOperationActions {
  FLAG_POST = "flagPost",
  SET_USER_TITLE = "setUserTitle",
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
  PIN_POST = "pinPost",
  UNPIN_POST = "unpinPost",
  UPDATE_PROPS = "updateProps",
  MUTE_POST = "mutePost",
  UNMUTE_POST = "unmutePost"
}

export class CommunityOperation extends HiveAppsOperation<CommunityOperation> {
  protected readonly id = "community";

  /**
   * Flags post on given community
   *
   * @param {string} community target community
   * @param {string} account author of the post to flag
   * @param {string} permlink post permlink to flag
   * @param {string} notes notes on the flag
   *
   * @returns {CommunityOperation} itself
   */
  public flagPost(community: string, account: TAccountName, permlink: string, notes: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.FLAG_POST,
      {
        community,
        account,
        permlink,
        notes
      }
    ]);

    return this;
  }

  /**
   * Sets title on the user
   *
   * @param {string} community target community
   * @param {string} account account to change the title
   * @param {string} title new account title
   *
   * @returns {CommunityOperation} itself
   */
  public setUserTitle(community: string, account: TAccountName, title: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.SET_USER_TITLE,
      {
        community,
        account,
        title
      }
    ]);

    return this;
  }

  /**
   * Subscribes to given community
   *
   * @param {string} community target community
   *
   * @returns {CommunityOperation} itself
   */
  public subscribe(community: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.SUBSCRIBE,
      {
        community
      }
    ]);

    return this;
  }

  /**
   * Unsubscribes from given community
   *
   * @param {string} community target community
   *
   * @returns {CommunityOperation} itself
   */
  public unsubscribe(community: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.UNSUBSCRIBE,
      {
        community
      }
    ]);

    return this;
  }

  /**
   * Pins given post on the community page
   *
   * @param {string} community target community
   * @param {string} account author of the post to pin
   * @param {string} permlink post permlink to pin
   *
   * @returns {CommunityOperation} itself
   */
  public pinPost(community: string, account: TAccountName, permlink: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.PIN_POST,
      {
        community,
        account,
        permlink
      }
    ]);

    return this;
  }

  /**
   * Unpins given post from the community page
   *
   * @param {string} community target community
   * @param {string} account author of the post to pin
   * @param {string} permlink post permlink to pin
   *
   * @returns {CommunityOperation} itself
   */
  public unpinPost(community: string, account: TAccountName, permlink: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.UNPIN_POST,
      {
        community,
        account,
        permlink
      }
    ]);

    return this;
  }

  /**
   * Updates props for the given community
   *
   * @param {string} community target community
   * @param {ICommunityProps} props community props
   *
   * @returns {CommunityOperation} itself
   */
  public updateProps(community: string, props: ICommunityProps): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.UPDATE_PROPS,
      {
        community,
        props: {
          title: props.title,
          about: props.about ?? "",
          description: props.description ?? "",
          flag_text: props.flag_text ?? "",
          is_nsfw: props.is_nsfw ?? false,
          lang: props.lang ?? ESupportedLanguages.ENGLISH
        } as Required<ICommunityProps>
      }
    ]);

    return this;
  }

  /**
   * Mutes post on given community
   *
   * @param {string} community target community
   * @param {string} account author of the post to mute
   * @param {string} permlink post permlink to mute
   * @param {string} notes notes on the mute
   *
   * @returns {CommunityOperation} itself
   */
  public mutePost(community: string, account: TAccountName, permlink: string, notes: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.MUTE_POST,
      {
        community,
        account,
        permlink,
        notes
      }
    ]);

    return this;
  }

  /**
   * Unmutes post on given community
   *
   * @param {string} community target community
   * @param {string} account author of the post to unmute
   * @param {string} permlink post permlink to unmute
   * @param {string} notes notes on the unmute
   *
   * @returns {CommunityOperation} itself
   */
  public unmutePost(community: string, account: TAccountName, permlink: string, notes: string): CommunityOperation {
    this.body.push([
      ECommunityOperationActions.UNMUTE_POST,
      {
        community,
        account,
        permlink,
        notes
      }
    ]);

    return this;
  }
}
