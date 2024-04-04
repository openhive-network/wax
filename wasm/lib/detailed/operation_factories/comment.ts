import type { TAccountName } from "../custom_jsons/builder";
import { comment } from "../../proto/comment.js";
import { beneficiary_route_type, comment_options, type comment_payout_beneficiaries } from "../../proto/comment_options.js";
import { NaiAsset } from "../index.js";
import { WaxError } from "../../errors.js";
import { IBuiltHiveAppsOperation, OperationBuilder } from "../operation_builder.js";

export enum ECommentFormat {
  HTML = "html",
  MARKDOWN = "markdown",
  MIXED = "markdown+html"
}

class CommentBuilder extends OperationBuilder {
  protected readonly comment: comment;
  private commentOptions?: comment_options;

  protected jsonMetadata: Record<string, any> = {
    format: ECommentFormat.MIXED
  };

  private extendDefaultJsonMetadata(optionalJsonMeta: { app?: string } = {}): void {
    const apps = [ `${process.env.npm_package_name}/${process.env.npm_package_version}` ];
    if(typeof optionalJsonMeta.app === "string")
      apps.unshift(optionalJsonMeta.app);

    Object.assign(this.jsonMetadata, optionalJsonMeta, { app: apps.join(", ") });
  }

  protected constructor(parentAuthor: TAccountName, parentPermlink: string, author: TAccountName, body: string, jsonMetadata?: object, permlink?: string, title: string = "") {
    super();

    if(permlink === undefined)
      permlink = `re-${parentAuthor}-${Date.now()}`;

    this.comment = comment.fromPartial({
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      body,
      permlink,
      title
    });

    this.extendDefaultJsonMetadata(jsonMetadata);
  }

  private ensureCommentOptionsCreated(): void {
    this.requireApi();

    if(typeof this.commentOptions === "undefined")
      this.commentOptions = comment_options.fromPartial({
        author: this.comment.author,
        permlink: this.comment.permlink,
        allow_curation_rewards: true,
        allow_votes: true,
        percent_hbd: 10000,
        max_accepted_payout: this.api!.hbd(1000000000)
      });
  }

  /**
   * Assigns given object or sets given value on key in comment meta values
   *
   * @param {string | object} keyOrObject key to set the value on or the entire object of key-value pairs to assign to the json metadata object
   * @param {?any} value value to be set (optional when passing the entire object)
   *
   * @throws {WaxError} if key already exists on the jsonmetadata object
   * @returns {CommentBuilder} itself
   */
  public pushMetadataProperty(keyOrObject: string | object, value?: any): CommentBuilder {
    const assign = (key: string, value: any) => {
      if(key in this.jsonMetadata)
        throw new WaxError("Key already exists on the json metadata object");

      this.jsonMetadata[key] = value;
    }

    if(typeof keyOrObject === "string")
      assign(keyOrObject, value);
    else
      for(const key in keyOrObject)
        assign(key, keyOrObject[key]);

    return this;
  }

  /**
   * Pushes tags to the json metadata object
   *
   * @param {string[]} tags tags to be pushed to the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public pushTags(...tags: string[]): CommentBuilder {
    if(tags.length === 0)
      return this;

    if(typeof this.jsonMetadata.tags === "undefined")
      this.jsonMetadata.tags = [];

    this.jsonMetadata.tags = [... new Set([ ...this.jsonMetadata.tags, ...tags ])];

    return this;
  }

  /**
   * Sets alternative author to the json metadata object
   *
   * @param {string} author alternative author to be set on the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public setAlternativeAuthor(author: string): CommentBuilder {
    this.jsonMetadata.author = author;

    return this;
  }

  /**
   * Pushes images to the json metadata object
   *
   * @param {string} images image to be pushed to the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public pushImages(...images: string[]): CommentBuilder {
    if(images.length === 0)
      return this;

    if(typeof this.jsonMetadata.image === "undefined")
      this.jsonMetadata.image = [];

    this.jsonMetadata.image.push(...images);

    return this;
  }

  /**
   * Pushes links to the json metadata object
   *
   * @param {string[]} links links to be pushed to the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public pushLinks(...links: string[]): CommentBuilder {
    if(links.length === 0)
      return this;

    if(typeof this.jsonMetadata.links === "undefined")
      this.jsonMetadata.links = [];

    this.jsonMetadata.links.push(...links);

    return this;
  }

  /**
   * Sets description on the json metadata object
   *
   * @param {string} description description to be set on the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public setDescription(description: string): CommentBuilder {
    this.jsonMetadata.description = description;

    return this;
  }

  /**
   * Sets format on the json metadata object
   *
   * @param {ECommentFormat} format format to be set on the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public setFormat(format: ECommentFormat): CommentBuilder {
    this.jsonMetadata.format = format;

    return this;
  }

  /**
   * Adds beneficiary account to the comment operation object
   *
   * @param {TAccountName} account beneficiary account
   * @param {number} weight weight of the beneficiary account
   *
   * @returns {CommentBuilder} itself
   */
  public addBeneficiary(account: TAccountName, weight: number): CommentBuilder {
    this.ensureCommentOptionsCreated();

    let beneficiary: comment_payout_beneficiaries | undefined;

    for(const ext of this.commentOptions!.extensions)
      if("comment_payout_beneficiaries" in ext)
        beneficiary = ext.comment_payout_beneficiaries;


    if(typeof beneficiary === "undefined")
      this.commentOptions!.extensions.push({
        comment_payout_beneficiaries: { beneficiaries: [ { account, weight } ] }
      });
    else
      beneficiary.beneficiaries.push({ account, weight });

    return this;
  }

  /**
   * Adds beneficiary account(s) to the comment operation object
   *
   * @param {Array<beneficiary_route_type>} accounts beneficiary accounts
   *
   * @returns {CommentBuilder} itself
   */
  public addBeneficiaries(...accounts: Array<beneficiary_route_type>): CommentBuilder {
    for(const { account, weight } of accounts)
      this.addBeneficiary(account, weight);

    return this;
  }

  /**
   * Sets maximum accepted payout on the comment
   *
   * @param {NaiAsset} amount Maximum accepted payout (defaults to `1000000.000 HBD`)
   *
   * @returns {CommentBuilder} itself
   * @see {@link comment_options.max_accepted_payout}
   */
  public setMaxAcceptedPayout(amount: NaiAsset): CommentBuilder {
    this.ensureCommentOptionsCreated();

    this.commentOptions!.max_accepted_payout = amount;

    return this;
  }

  /**
   * Sets percent hbd
   *
   * @param {number} value percent hbd (defaults to `10000` - `HIVE_100_PERCENT`)
   *
   * @returns {CommentBuilder} itself
   * @see {@link comment_options.percent_hbd}
   */
  public setPercentHbd(value: number): CommentBuilder {
    this.ensureCommentOptionsCreated();

    this.commentOptions!.percent_hbd = value;

    return this;
  }

  /**
   * Sets allow curation rewards
   *
   * @param {boolean} value allow curation rewards value (defaults to `true`)
   *
   * @returns {CommentBuilder} itself
   * @see {@link comment_options.allow_curation_rewards}
   */
  public setAllowCurationRewards(value: boolean): CommentBuilder {
    this.ensureCommentOptionsCreated();

    this.commentOptions!.allow_curation_rewards = value;

    return this;
  }

  /**
   * Sets allow votes
   *
   * @param {boolean} value allow votes value (defaults to `true`)
   *
   * @returns {CommentBuilder} itself
   * @see {@link comment_options.allow_votes}
   */
  public setAllowVotes(value: boolean): CommentBuilder {
    this.ensureCommentOptionsCreated();

    this.commentOptions!.allow_votes = value;

    return this;
  }

  /**
   * @internal
   */
  public override build(): IBuiltHiveAppsOperation {
    // Apply cached json metadata before pushing the comment operation
    this.comment.json_metadata = JSON.stringify(this.jsonMetadata);

    this.push({ comment: this.comment });

    if(typeof this.commentOptions === "object")
      this.push({ comment_options: this.commentOptions });

    return this.builtOperations;
  }
}

/**
 * Same as the comment builder base, but requires parentAuthor and parentPermlink to be set
 */
export class ReplyBuilder extends CommentBuilder {
  public constructor(parentAuthor: TAccountName, parentPermlink: string, author: TAccountName, body: string, jsonMetadata?: object, permlink?: string, title: string = "") {
    super(parentAuthor, parentPermlink, author, body, jsonMetadata, permlink, title);

    if(parentAuthor.length === 0)
      throw new WaxError('No parent author specified in the reply builder');

    if(parentPermlink.length === 0)
      throw new WaxError('No parent permlink specified in the reply builder');
  }
}

/**
 * Same as the comment builder base, but requires user to set the category (parent permlink) on the comment
 */
export class ArticleBuilder extends CommentBuilder {
  public constructor(author: TAccountName, permlink: string, title: string, body: string, jsonMetadata?: object) {
    super('', '', author, body, jsonMetadata, permlink, title);
  }

  /**
   * Sets category of the article
   *
   * @param {string} category category (parent permlink) and also the first tag
   *
   * @returns {CommentBuilder} ready to build transaction builder
   */
  setCategory(category: string): CommentBuilder {
    this.comment.parent_permlink = category;

    return this;
  }
}
