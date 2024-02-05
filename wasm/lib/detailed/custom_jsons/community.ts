import { HiveAppsOperationsBuilder, TAccountName } from './builder.js';

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

export class CommunityOperationBuilder extends HiveAppsOperationsBuilder<CommunityOperationBuilder> {
  protected readonly id = "community";

  /**
   * Flags post on given community
   *
   * @param {string} community target community
   * @param {string} account author of the post to flag
   * @param {string} permlink post permlink to flag
   * @param {string} notes notes on the flag
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public flagPost(community: string, account: TAccountName, permlink: string, notes: string): CommunityOperationBuilder {
    this.body = [
      "flagPost",
      {
        community,
        account,
        permlink,
        notes
      }
    ];

    return this;
  }

  /**
   * Sets title on the user
   *
   * @param {string} community target community
   * @param {string} account account to change the title
   * @param {string} title new account title
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public setUserTitle(community: string, account: TAccountName, title: string): CommunityOperationBuilder {
    this.body = [
      "setUserTitle",
      {
        community,
        account,
        title
      }
    ];

    return this;
  }

  /**
   * Subscribes to given community
   *
   * @param {string} community target community
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public subscribe(community: string): CommunityOperationBuilder {
    this.body = [
      "subscribe",
      {
        community
      }
    ];

    return this;
  }

  /**
   * Unsubscribes from given community
   *
   * @param {string} community target community
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public unsubscribe(community: string): CommunityOperationBuilder {
    this.body = [
      "unsubscribe",
      {
        community
      }
    ];

    return this;
  }

  /**
   * Pins given post on the community page
   *
   * @param {string} community target community
   * @param {string} account author of the post to pin
   * @param {string} permlink post permlink to pin
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public pinPost(community: string, account: TAccountName, permlink: string): CommunityOperationBuilder {
    this.body = [
      "pinPost",
      {
        community,
        account,
        permlink
      }
    ];

    return this;
  }

  /**
   * Unpins given post from the community page
   *
   * @param {string} community target community
   * @param {string} account author of the post to pin
   * @param {string} permlink post permlink to pin
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public unpinPost(community: string, account: TAccountName, permlink: string): CommunityOperationBuilder {
    this.body = [
      "unpinPost",
      {
        community,
        account,
        permlink
      }
    ];

    return this;
  }

  /**
   * Updates props for the given community
   *
   * @param {string} community target community
   * @param {ICommunityProps} props community props
   *
   * @returns {CommunityOperationBuilder} itself
   */
  public updateProps(community: string, props: ICommunityProps): CommunityOperationBuilder {
    this.body = [
      "updateProps",
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
    ];

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
   * @returns {CommunityOperationBuilder} itself
   */
  public mutePost(community: string, account: TAccountName, permlink: string, notes: string): CommunityOperationBuilder {
    this.body = [
      "mutePost",
      {
        community,
        account,
        permlink,
        notes
      }
    ];

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
   * @returns {CommunityOperationBuilder} itself
   */
  public unmutePost(community: string, account: TAccountName, permlink: string, notes: string): CommunityOperationBuilder {
    this.body = [
      "unmutePost",
      {
        community,
        account,
        permlink,
        notes
      }
    ];

    return this;
  }
}
