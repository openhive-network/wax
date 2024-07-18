import { asset, operation } from "../../protocol.js";
import type { TAccountName } from "../custom_jsons";
import { update_proposal } from "../../proto/update_proposal.js";
import { AOperationFactory, IOperationFactorySink } from "../operation_builder.js";

interface IUpdateProposalData {
  /**
   * The identifier of the proposal to be updated.
   */
  proposalId: string | number;
  /**
   * The account name of the proposal creator.
   */
  creator: TAccountName;
  /**
   * The daily pay of the proposal.
   * **A user who created the proposal may modify it**.
   */
  dailyPay: asset;
  /**
   * The subject of the proposal.
   * **A user who created the proposal may modify it**.
   */
  subject: string;
  /**
   * The permlink of the proposal.
   * **A user who created the proposal may modify it**.
   */
  permlink: string;
  /**
   * The end date of the proposal.
   * **A user who created the proposal may modify it**.
   */
  endDate?: number | string | Date;
}

export class UpdateProposalFactory extends AOperationFactory {
  private readonly updateProposal: update_proposal;

  public constructor(props: IUpdateProposalData) {
    super();

    this.updateProposal = update_proposal.fromPartial({
      proposal_id: props.proposalId.toString(),
      creator: props.creator,
      daily_pay: props.dailyPay,
      subject: props.subject,
      permlink: props.permlink
    });

    if(typeof props.endDate !== "undefined")
      this.addEndDate(props.endDate);
  }

  /**
   * Adds end date to the update proposal
   *
   * @param {string | number | Date} endDate end date
   * @returns {UpdateProposalFactory} itself
   */
  private addEndDate(endDate: string | number | Date): UpdateProposalFactory {
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
  public finalize(_sink: IOperationFactorySink): Iterable<operation> {
    return [{ update_proposal: this.updateProposal }];
  }
}
