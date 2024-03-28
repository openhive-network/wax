import type { ITransactionBuilder } from "../../interfaces";
import type { TransactionBuilder } from "../transaction_builder";
import { update_proposal } from "../../proto/update_proposal.js";

export class UpdateProposalBuilder {
  private readonly updateProposal: update_proposal;

  public constructor(private readonly txBuilder: TransactionBuilder, updateProposalObject: Partial<update_proposal>, endDate?: string | Date | number) {
    this.updateProposal = update_proposal.fromPartial(updateProposalObject);

    if(typeof endDate !== "undefined")
      this.addEndDate(endDate);
  }

  /**
   * Adds end date to the update proposal
   *
   * @param {string | number | Date} endDate end date
   * @returns {UpdateProposalBuilder} itself
   */
  private addEndDate(endDate: string | number | Date): UpdateProposalBuilder {
    if(typeof endDate === "string" && !endDate.endsWith("Z"))
      endDate += "Z";

    this.updateProposal.extensions.push({
      update_proposal_end_date: {
        end_date: new Date(endDate).toISOString().slice(0, -5)
      }
    });

    return this;
  }

  /**
   * Pushes the prepared operation to the transaction builder operations and returns the transaction builder
   *
   * @returns {ITransactionBuilder} transaction builder object
   */
  public store(): ITransactionBuilder {
    this.txBuilder.push({ update_proposal: this.updateProposal });

    return this.txBuilder;
  }
}
