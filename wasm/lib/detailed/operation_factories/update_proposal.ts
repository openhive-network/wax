import type { asset } from "../../protocol";
import type { TAccountName } from "../custom_jsons";
import { update_proposal } from "../../proto/update_proposal.js";
import { IBuiltHiveAppsOperation, OperationBuilder } from "../operation_builder.js";

export class UpdateProposalBuilder extends OperationBuilder {
  private readonly updateProposal: update_proposal;

  public constructor(proposalId: string | number, creator: TAccountName, dailyPay: asset, subject: string, permlink: string, endDate?: number | string | Date) {
    super();

    this.updateProposal = update_proposal.fromPartial({
      proposal_id: proposalId.toString(),
      creator,
      daily_pay: dailyPay,
      subject,
      permlink
    });

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
   * @internal
   */
  public override build(): IBuiltHiveAppsOperation {
    this.push({ update_proposal: this.updateProposal });

    return this.builtOperations;
  }
}
