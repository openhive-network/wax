import type { TAccountName } from "../hive_apps_operations/factory";
import { operation, comment, asset } from "../../protocol.js";
import { beneficiary_route_type, comment_options, type comment_payout_beneficiaries } from "../../proto/comment_options.js";
import { WaxError } from "../../errors.js";
import { OperationBase, IOperationSink } from "../operation_base.js";
import Long from "long";
import { isNaiAsset } from "../util/asset_util.js";

export enum ECommentFormat {
  HTML = "html",
  MARKDOWN = "markdown",
  MIXED = "markdown+html"
}

export interface ICommentData {
  /**
   * Account name, the author of the commented post or comment.
   * If the operation creates a post, it is empty.
   */
  parentAuthor: TAccountName;
  /**
   * The identifier of the commented post or comment.
   * When a user creates a post, it may contain the identifier of the community (e.g. hive-174695) or main tag (e.g. travel).
   * **It cannot be modified**.
   */
  parentPermlink: string;
  /**
   * Account name, the author of the post or the comment.
   * **It cannot be modified**
   */
  author: TAccountName;
  /**
   * The content of the post or the comment.
   * **It may be modified**.
   */
  body: string;
  /**
   * There is no blockchain validation on json_metadata, but the structure has been established by the community.
   * From the blockchain point of view it is a json file.
   * For the second layer, the following keys may be used:
   * - app, e.g. peakd/2023.2.3
   * - format, e.g. markdown
   * - tags, e.g. photography
   * - users
   * - images
   */
  jsonMetadata: object;
  /**
   * Unique to the author, the identifier of the post or comment.
   * **It cannot be modified**.
   */
  permlink: string;
  /**
   * The title of the submitted post, in case of the comment, is often empty.
   * **It may be modified**.
   */
  title: string;

  /**
   * The format of the comment.
   * Currently supported formats are: html, markdown, markdown+html.
   *
   * @see {@link ECommentFormat}
   */
  format?: ECommentFormat;
  /**
   * The description of the post.
   */
  description?: string;
  /**
   * The links in the post.
   */
  links?: string[];
  /**
   * The images in the post.
   */
  images?: string[];
  /**
   * The alternative author of the post.
   */
  alternativeAuthor?: TAccountName;
  /**
   * The tags of the post.
   */
  tags?: string[];

  /**
   * The beneficiaries of the post including account and the weight.
   * Setting this property will create an additional comment_options operation.
   */
  beneficiaries?: beneficiary_route_type[];

  /**
   * Allow or disallow curation rewards for the post.
   * Setting this property will create an additional comment_options operation.
   *
   * @default true
   */
  allowCurationRewards?: boolean;
  /**
   * Allow or disallow votes for the post.
   * Setting this property will create an additional comment_options operation.
   *
   * @default true
   */
  allowVotes?: boolean;
  /**
   * The percentage of the HBD reward.
   * Setting this property will create an additional comment_options operation.
   *
   * @default 10000
   */
  percentHbd?: number;
  /**
   * The maximum accepted payout for the post.
   * Setting this property will create an additional comment_options operation.
   *
   * @default 1_000_000_000
   */
  maxAcceptedPayout?: asset | Long | string | BigInt | number;
}

export interface IReplyData extends Omit<ICommentData, 'jsonMetadata' | 'permlink' | 'title'> {
  jsonMetadata?: object;
  permlink?: string;
  title?: string;
}

export interface IArticle extends Omit<ICommentData, 'jsonMetadata' | 'permlink' | 'parentAuthor' | 'parentPermlink'> {
  category: string;
  jsonMetadata?: object;
  permlink?: string;
}

class CommentOperation extends OperationBase {
  protected readonly comment: comment;
  private commentOptions?: comment_options;

  protected jsonMetadata: Record<string, any> = {
    format: ECommentFormat.MIXED
  };

  private maxAcceptedPayoutToSet?: asset | Long | string | BigInt | number;

  /**
   * @internal
   */
  public finalize(sink: IOperationSink): Iterable<operation> {
    // Apply cached json metadata before pushing the comment operation
    this.comment.json_metadata = JSON.stringify(this.jsonMetadata);

    const operations: operation[] = [];

    operations.push({ comment: this.comment });

    if(typeof this.commentOptions === "object") {
      if (this.maxAcceptedPayoutToSet !== undefined) {
        let payout: asset;

        if (isNaiAsset(this.maxAcceptedPayoutToSet))
          payout = this.maxAcceptedPayoutToSet as asset;
        else
          payout = sink.api.hbdSatoshis(this.maxAcceptedPayoutToSet as number | string | BigInt | Long);

        this.commentOptions.max_accepted_payout = payout;
      }

      operations.push({ comment_options: this.commentOptions });
    }

    return operations;
  }

  private extendDefaultJsonMetadata(optionalJsonMeta: { app?: string }): void {
    const apps = [ `${process.env.npm_package_name}/${process.env.npm_package_version}` ];
    if(typeof optionalJsonMeta.app === "string")
      apps.unshift(optionalJsonMeta.app);

    Object.assign(this.jsonMetadata, optionalJsonMeta, { app: apps.join(", ") });
  }

  protected constructor(data: ICommentData) {
    super();

    this.comment = comment.fromPartial({
      parent_author: data.parentAuthor,
      parent_permlink: data.parentPermlink,
      author: data.author,
      body: data.body,
      permlink: data.permlink,
      title: data.title
    });

    this.extendDefaultJsonMetadata(data.jsonMetadata);

    if (data.allowCurationRewards !== undefined)
      this.ensureCommentOptionsCreated().allow_curation_rewards = data.allowCurationRewards;

    if (data.allowVotes !== undefined)
      this.ensureCommentOptionsCreated().allow_votes = data.allowVotes;

    if (data.percentHbd !== undefined)
      this.ensureCommentOptionsCreated().percent_hbd = data.percentHbd;

    if (data.maxAcceptedPayout !== undefined) {
      this.ensureCommentOptionsCreated();

      this.maxAcceptedPayoutToSet = data.maxAcceptedPayout;
    }

    if (data.tags !== undefined && data.tags.length > 0) {
      if(this.jsonMetadata.tags === undefined)
        this.jsonMetadata.tags = [];

      this.jsonMetadata.tags = [... new Set([ ...this.jsonMetadata.tags, ...data.tags ])];
    }

    if (data.images !== undefined && data.images.length > 0) {
      if(this.jsonMetadata.image === undefined)
        this.jsonMetadata.image = [];

      this.jsonMetadata.image.push(...data.images);
    }

    if (data.links !== undefined && data.links.length > 0) {
      if(this.jsonMetadata.links === undefined)
        this.jsonMetadata.links = [];

      this.jsonMetadata.links.push(...data.links);
    }

    if (data.alternativeAuthor !== undefined)
      this.jsonMetadata.author = data.alternativeAuthor;

    if (data.description !== undefined)
      this.jsonMetadata.description = data.description;

    if (data.format !== undefined)
      this.jsonMetadata.format = data.format;

    if (data.beneficiaries !== undefined)
      for(const { account, weight } of data.beneficiaries)
        this.addBeneficiary(account, weight);
  }

  private ensureCommentOptionsCreated(): comment_options {
    if(this.commentOptions === undefined) {
      this.maxAcceptedPayoutToSet = 1000000000;

      this.commentOptions = comment_options.fromPartial({
        author: this.comment.author,
        permlink: this.comment.permlink,
        allow_curation_rewards: true,
        allow_votes: true,
        percent_hbd: 10000,
        max_accepted_payout: undefined
      });
    }

    return this.commentOptions;
  }

  /**
   * Assigns given object or sets given value on key in comment meta values
   *
   * @param {string | object} keyOrObject key to set the value on or the entire object of key-value pairs to assign to the json metadata object
   * @param {?any} value value to be set (optional when passing the entire object)
   *
   * @throws {WaxError} if key already exists on the jsonmetadata object
   * @returns {CommentOperation} itself
   */
  public pushMetadataProperty(keyOrObject: string | object, value?: any): CommentOperation {
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
   * Adds beneficiary account to the comment operation object
   *
   * @param {TAccountName} account beneficiary account
   * @param {number} weight weight of the beneficiary account
   *
   * @returns {CommentOperation} itself
   */
  private addBeneficiary(account: TAccountName, weight: number): CommentOperation {
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
}

/**
 * Same as the comment base, but requires parentAuthor and parentPermlink to be set
 */
export class ReplyOperation extends CommentOperation {
  public constructor(data: IReplyData) {
    super({
      ...data,
      jsonMetadata: data.jsonMetadata ?? {},
      permlink: data.permlink ?? `re-${data.parentAuthor}-${Date.now()}`,
      title: data.title ?? ""
    });

    if(data.parentAuthor.length === 0)
      throw new WaxError('No parent author specified in the reply operation');

    if(data.parentPermlink.length === 0)
      throw new WaxError('No parent permlink specified in the reply operation');
  }
}

/**
 * Same as the comment base, but requires user to set the category (parent permlink) on the comment
 */
export class BlogPostOperation extends CommentOperation {
  public constructor(data: IArticle) {
    super({
      ...data,
      parentAuthor: '',
      parentPermlink: data.category,
      jsonMetadata: data.jsonMetadata ?? {},
      permlink: data.permlink ?? `${data.author}-${Date.now()}`
    });
  }
}
