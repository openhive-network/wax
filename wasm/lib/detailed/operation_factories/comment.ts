import type { TransactionBuilder } from "../transaction_builder.js";
import type { ITransactionBuilder } from "../../interfaces";
import type { TAccountName } from "../custom_jsons/builder";
import { comment } from "../../proto/comment.js";
import { comment_options } from "../../proto/comment_options.js";

export class CommentBuilder {
  private readonly comment: comment;
  private commentOptions?: comment_options;

  public constructor(private readonly txBuilder: TransactionBuilder, commentObject: Partial<comment>) {
    this.comment = comment.fromPartial(commentObject);
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
    if(typeof this.commentOptions === "undefined")
      this.commentOptions = comment_options.fromPartial({
        author: this.comment.author,
        permlink: this.comment.permlink
      });

    this.commentOptions.extensions.push({
      comment_payout_beneficiaries: { beneficiaries: [ { account, weight } ] }
    });

    return this;
  }

  /**
   * Pushes the prepared operation to the transaction builder operations and returns the transaction builder
   *
   * @returns {ITransactionBuilder} transaction builder object
   */
  public build(): ITransactionBuilder {
    this.txBuilder.push({ comment: this.comment });

    if(typeof this.commentOptions === "object")
      this.txBuilder.push({ comment_options: this.commentOptions });

    return this.txBuilder;
  }
}
