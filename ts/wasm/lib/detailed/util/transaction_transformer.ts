import { BeneficiaryRoutesArray, ClassHandle, IProtoTransactionTransformer, json_asset, VectorString } from "wasm/lib/build_wasm/wax.common";
//import { WaxBaseApi } from "../base_api";
import { beneficiary_route_type, comment_payout_beneficiaries, comment_options_extension, type asset, type comment_options, type operation, type transaction, custom_json } from "../protocol";

export class ApiTransaction2ProtoTransactionTransformer implements IProtoTransactionTransformer {
    private deletedInstance: boolean = false;
    private outputTransaction!: transaction;

    public constructor(/*private readonly base: WaxBaseApi*/) {
    }

    public getOutputTransaction(): transaction {
      return this.outputTransaction;
    }

    public startTransaction(ref_block_num: number, ref_block_prefix: number, expirationTime: string): void {
      this.outputTransaction = {
        ref_block_num: ref_block_num,
        ref_block_prefix: ref_block_prefix,
        expiration: expirationTime,
        extensions: [],
        operations: [],
        signatures: []
      };
    }

    addVoteOperation(voter: string, author: string, permlink: string, weight: number): void {
      const op: operation = {
        vote: {voter, author, permlink, weight}
      };

      this.outputTransaction.operations.push(op);
    }

    addCommentOperation(author: string, permlink: string, parent_author: string, parent_permlink: string, title: string, json_metadata: string, body: string): void {
      const op: operation = {
        comment: {author, permlink, parent_author, parent_permlink, title, json_metadata, body}
      };

      this.outputTransaction.operations.push(op);
    }

    /// FIXME check beneficiariesExtensions - seems to be incorrectly flattened
    addCommentOptionsOperation(author: string, permlink: string, max_accepted_payout: json_asset, percent_hbd: number, allow_votes: boolean, allow_curation_rewards: boolean, beneficiariesExtensions: BeneficiaryRoutesArray): void {

      const _max_accepted_payout: asset = {
        amount: max_accepted_payout.amount.toString(),
        precision: max_accepted_payout.precision, 
        nai: max_accepted_payout.nai.toString()
      };

      const extensions: comment_options_extension[] = [];
      const routes: beneficiary_route_type[] = [];

      for(let i = 0; i < beneficiariesExtensions.size(); i++) {  
        const sourceBeneficiary = beneficiariesExtensions.get(i)!;

        routes.push({
          account: sourceBeneficiary.account.toString(),
          weight: sourceBeneficiary.weight
        });

        const beneficiaries: comment_payout_beneficiaries = {
          beneficiaries: routes
        };

        extensions.push({comment_payout_beneficiaries: beneficiaries});
      }

      const body: comment_options = {
        author,
        permlink,
        max_accepted_payout: _max_accepted_payout,
        percent_hbd,
        allow_votes,
        allow_curation_rewards,
        extensions
      };

      const op: operation = {
        comment_options: body
      };

      this.outputTransaction.operations.push(op);
    }

    public addCustomJsonOperation(_required_auths: VectorString, _required_posting_auths: VectorString, id: string, json: string): void {
      
      const required_auths: string[] = [];
      
      for(let i = 0; i < _required_auths.size(); i++) {
        const sourceRequiredAuth = _required_auths.get(i)!;
        required_auths.push(sourceRequiredAuth.toString());
      }

      const required_posting_auths: string[] = [];

      for(let i = 0; i < _required_posting_auths.size(); i++) {
        const sourceRequiredAuth = _required_posting_auths.get(i)!;
        required_posting_auths.push(sourceRequiredAuth.toString());
      }

      const body: custom_json = {
        required_auths,
        required_posting_auths,
        id,
        json
      };

      const op: operation = {
        custom_json: body
      };

      this.outputTransaction.operations.push(op);
    }

    addTransferOperation(sender: string, receiver: string, amount: json_asset, memo: string): void {
      const op: operation = {
        transfer: {from_account: sender, to_account: receiver, amount: {
          amount: amount.amount.toString(),
          precision: amount.precision,
          nai: amount.nai.toString()
        },
         memo}
      };

      this.outputTransaction.operations.push(op);
    }

    addSignature(signature: string): void {
      this.outputTransaction.signatures.push(signature);
    }

    public delete(): void {
        this.deletedInstance = true;
    }

    public isAliasOf(other: ClassHandle): boolean {
        return this === other;
    }

    public deleteLater(): this {
        return this;
    }

    public isDeleted(): boolean {
        return this.deletedInstance;
    }

    public clone(): this {
        return structuredClone(this);
    }
};
