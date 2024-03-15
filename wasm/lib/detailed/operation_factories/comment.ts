import type { TransactionBuilder } from "../transaction_builder.js";
import type { ITransactionBuilder } from "../../interfaces";
import type { TAccountName } from "../custom_jsons/builder";
import { comment } from "../../proto/comment.js";
import { comment_options, type comment_payout_beneficiaries } from "../../proto/comment_options.js";
import { NaiAsset } from "../index.js";
import { WaxError } from "../../errors.js";

export enum ECommentFormat {
  HTML = "html",
  MARKDOWN = "markdown",
  MIXED = "markdown+html"
}

export class CommentBuilder {
  protected readonly comment: comment;
  private commentOptions?: comment_options;

  protected jsonMetadata: Record<string, any> = {
    format: ECommentFormat.MIXED
  };

  private extendDefaultJsonMetadata(optionalJsonMeta: string = "{}"): void {
    const parsed = JSON.parse(optionalJsonMeta);
    const apps = [ `${process.env.npm_package_name}/${process.env.npm_package_version}` ];
    if(typeof parsed.app === "string")
      apps.unshift(parsed.app);

    Object.assign(this.jsonMetadata, parsed, { app: apps.join(", ") });
  }

  public constructor(private readonly txBuilder: TransactionBuilder, commentObject: Partial<comment>) {
    this.comment = comment.fromPartial({
      ...commentObject
    });

    this.extendDefaultJsonMetadata(commentObject.json_metadata);
  }

  private ensureCommentOptionsCreated(): void {
    if(typeof this.commentOptions === "undefined")
      this.commentOptions = comment_options.fromPartial({
        author: this.comment.author,
        permlink: this.comment.permlink,
        allow_curation_rewards: true,
        allow_votes: true,
        percent_hbd: 10000,
        max_accepted_payout: this.txBuilder.api.hbd(1000000000)
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
   * @param {string} tag tag to be pushed to the json metadata object
   * @param {string[]} otherTags other tags to be pushed to the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public pushTags(tag: string, ...otherTags: string[]): CommentBuilder {
    if(typeof this.jsonMetadata.tags === "undefined")
      this.jsonMetadata.tags = [];

    this.jsonMetadata.tags.push(tag, ...otherTags);

    return this;
  }

  /**
   * Pushes alternative users to the json metadata object
   *
   * @param {string} user alternative user to be pushed to the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public setAlternativeAuthor(user: string): CommentBuilder {
    this.jsonMetadata.author = user;

    return this;
  }

  /**
   * Pushes images to the json metadata object
   *
   * @param {string} image image to be pushed to the json metadata object (this image will be your post cover image)
   * @param {string[]} otherImages other images to be pushed to the json metadata object (Other images contained in the post - optional)
   *
   * @returns {CommentBuilder} itself
   */
  public pushImages(image: string, ...otherImages: string[]): CommentBuilder {
    if(typeof this.jsonMetadata.image === "undefined")
      this.jsonMetadata.image = [];

    this.jsonMetadata.image.push(image, ...otherImages);

    return this;
  }

  /**
   * Pushes links to the json metadata object
   *
   * @param {string} link link to be pushed to the json metadata object
   * @param {string[]} otherLinks other links to be pushed to the json metadata object
   *
   * @returns {CommentBuilder} itself
   */
  public pushLinks(link: string, ...otherLinks: string[]): CommentBuilder {
    if(typeof this.jsonMetadata.links === "undefined")
      this.jsonMetadata.links = [];

    this.jsonMetadata.links.push(link, ...otherLinks);

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
   * Pushes the prepared operation to the transaction builder operations and returns the transaction builder
   *
   * @returns {ITransactionBuilder} transaction builder object
   */
  public build(): ITransactionBuilder {
    // Apply cached json metadata before pushing the comment operation
    this.comment.json_metadata = JSON.stringify(this.jsonMetadata);

    this.txBuilder.push({ comment: this.comment });

    if(typeof this.commentOptions === "object")
      this.txBuilder.push({ comment_options: this.commentOptions });

    return this.txBuilder;
  }
}

/**
 * Same as the comment builder base, but requires user to set the category (parent permlink) on the comment
 */
export class RootCommentBuilder extends CommentBuilder {
  public constructor(txBuilder: TransactionBuilder, commentObject: Partial<comment>) {
    super(txBuilder, commentObject);
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

    if(typeof this.jsonMetadata.tags === "undefined")
      this.jsonMetadata.tags = [];

    this.jsonMetadata.tags.unshift(category);

    return this;
  }
}

export type TArticleBuilder = Omit<RootCommentBuilder, 'build'>;
