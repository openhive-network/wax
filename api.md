
<a name="_modulesmd"></a>

# @hive/wax

## Enumerations

- [ECommentFormat](#enumsecommentformatmd)
- [ECommunityOperationActions](#enumsecommunityoperationactionsmd)
- [EFollowActions](#enumsefollowactionsmd)
- [EFollowBlogAction](#enumsefollowblogactionmd)
- [EFollowOperationActions](#enumsefollowoperationactionsmd)
- [EManabarType](#enumsemanabartypemd)
- [ESupportedLanguages](#enumsesupportedlanguagesmd)
- [TTransactionPackType](#enumsttransactionpacktypemd)

## Classes

- [ApiAccount](#classesapiaccountmd)
- [ApiAccountAuth](#classesapiaccountauthmd)
- [ApiAuthority](#classesapiauthoritymd)
- [ApiBlock](#classesapiblockmd)
- [ApiBlockHeader](#classesapiblockheadermd)
- [ApiDelayedVote](#classesapidelayedvotemd)
- [ApiKeyAuth](#classesapikeyauthmd)
- [ApiManabar](#classesapimanabarmd)
- [ApiOperation](#classesapioperationmd)
- [ApiTransaction](#classesapitransactionmd)
- [ArticleBuilder](#classesarticlebuildermd)
- [BroadcastTransactionRequest](#classesbroadcasttransactionrequestmd)
- [BroadcastTransactionResponse](#classesbroadcasttransactionresponsemd)
- [CommunityOperation](#classescommunityoperationmd)
- [CommunityOperationBuilder](#classescommunityoperationbuildermd)
- [FindAccountsRequest](#classesfindaccountsrequestmd)
- [FindAccountsResponse](#classesfindaccountsresponsemd)
- [FindRcAccountsRequest](#classesfindrcaccountsrequestmd)
- [FindRcAccountsResponse](#classesfindrcaccountsresponsemd)
- [FollowOperation](#classesfollowoperationmd)
- [FollowOperationBuilder](#classesfollowoperationbuildermd)
- [GetBlockHeaderRequest](#classesgetblockheaderrequestmd)
- [GetBlockHeaderResponse](#classesgetblockheaderresponsemd)
- [GetBlockRangeRequest](#classesgetblockrangerequestmd)
- [GetBlockRangeResponse](#classesgetblockrangeresponsemd)
- [GetBlockRequest](#classesgetblockrequestmd)
- [GetBlockResponse](#classesgetblockresponsemd)
- [GetDynamicGlobalPropertiesRequest](#classesgetdynamicglobalpropertiesrequestmd)
- [GetDynamicGlobalPropertiesResponse](#classesgetdynamicglobalpropertiesresponsemd)
- [GetKeyReferencesRequest](#classesgetkeyreferencesrequestmd)
- [GetKeyReferencesResponse](#classesgetkeyreferencesresponsemd)
- [HiveAppsOperation](#classeshiveappsoperationmd)
- [HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd)
- [NaiAsset](#classesnaiassetmd)
- [OperationVisitor](#classesoperationvisitormd)
- [RcAccount](#classesrcaccountmd)
- [ReblogOperation](#classesreblogoperationmd)
- [RecurrentTransferBuilder](#classesrecurrenttransferbuildermd)
- [RecurrentTransferPairIdBuilder](#classesrecurrenttransferpairidbuildermd)
- [ReplyBuilder](#classesreplybuildermd)
- [ResourceCreditsOperation](#classesresourcecreditsoperationmd)
- [ResourceCreditsOperationBuilder](#classesresourcecreditsoperationbuildermd)
- [UpdateProposalBuilder](#classesupdateproposalbuildermd)
- [VerifyAuthorityRequest](#classesverifyauthorityrequestmd)
- [VerifyAuthorityResponse](#classesverifyauthorityresponsemd)
- [WaxFormatter](#classeswaxformattermd)
- [WaxFormatterBase](#classeswaxformatterbasemd)

## Interfaces

- [ICommunityProps](#interfacesicommunitypropsmd)
- [IEncryptingTransactionBuilder](#interfacesiencryptingtransactionbuildermd)
- [IFormatFunctionArguments](#interfacesiformatfunctionargumentsmd)
- [IHiveAssetData](#interfacesihiveassetdatamd)
- [IHiveChainInterface](#interfacesihivechaininterfacemd)
- [IManabarData](#interfacesimanabardatamd)
- [ITransactionBuilder](#interfacesitransactionbuildermd)
- [ITransactionBuilderConstructor](#interfacesitransactionbuilderconstructormd)
- [IWaxBaseInterface](#interfacesiwaxbaseinterfacemd)
- [IWaxCustomFormatter](#interfacesiwaxcustomformattermd)
- [IWaxExtendableFormatter](#interfacesiwaxextendableformattermd)
- [IWaxFormatter](#interfacesiwaxformattermd)
- [IWaxFormatterOptions](#interfacesiwaxformatteroptionsmd)
- [IWaxOptions](#interfacesiwaxoptionsmd)
- [IWaxOptionsChain](#interfacesiwaxoptionschainmd)
- [account\_create](#interfacesaccount_createmd)
- [account\_create\_with\_delegation](#interfacesaccount_create_with_delegationmd)
- [account\_created](#interfacesaccount_createdmd)
- [account\_update](#interfacesaccount_updatemd)
- [account\_update2](#interfacesaccount_update2md)
- [account\_witness\_proxy](#interfacesaccount_witness_proxymd)
- [account\_witness\_vote](#interfacesaccount_witness_votemd)
- [asset](#interfacesassetmd)
- [author\_reward](#interfacesauthor_rewardmd)
- [authority](#interfacesauthoritymd)
- [block](#interfacesblockmd)
- [cancel\_transfer\_from\_savings](#interfacescancel_transfer_from_savingsmd)
- [change\_recovery\_account](#interfaceschange_recovery_accountmd)
- [changed\_recovery\_account](#interfaceschanged_recovery_accountmd)
- [claim\_account](#interfacesclaim_accountmd)
- [claim\_reward\_balance](#interfacesclaim_reward_balancemd)
- [clear\_null\_account\_balance](#interfacesclear_null_account_balancemd)
- [collateralized\_convert](#interfacescollateralized_convertmd)
- [collateralized\_convert\_immediate\_conversion](#interfacescollateralized_convert_immediate_conversionmd)
- [comment](#interfacescommentmd)
- [comment\_benefactor\_reward](#interfacescomment_benefactor_rewardmd)
- [comment\_options](#interfacescomment_optionsmd)
- [comment\_payout\_update](#interfacescomment_payout_updatemd)
- [comment\_reward](#interfacescomment_rewardmd)
- [consolidate\_treasury\_balance](#interfacesconsolidate_treasury_balancemd)
- [convert](#interfacesconvertmd)
- [create\_claimed\_account](#interfacescreate_claimed_accountmd)
- [create\_proposal](#interfacescreate_proposalmd)
- [curation\_reward](#interfacescuration_rewardmd)
- [custom](#interfacescustommd)
- [custom\_json](#interfacescustom_jsonmd)
- [decline\_voting\_rights](#interfacesdecline_voting_rightsmd)
- [declined\_voting\_rights](#interfacesdeclined_voting_rightsmd)
- [delayed\_voting](#interfacesdelayed_votingmd)
- [delegate\_vesting\_shares](#interfacesdelegate_vesting_sharesmd)
- [delete\_comment](#interfacesdelete_commentmd)
- [dhf\_conversion](#interfacesdhf_conversionmd)
- [dhf\_funding](#interfacesdhf_fundingmd)
- [effective\_comment\_vote](#interfaceseffective_comment_votemd)
- [escrow\_approve](#interfacesescrow_approvemd)
- [escrow\_approved](#interfacesescrow_approvedmd)
- [escrow\_dispute](#interfacesescrow_disputemd)
- [escrow\_rejected](#interfacesescrow_rejectedmd)
- [escrow\_release](#interfacesescrow_releasemd)
- [escrow\_transfer](#interfacesescrow_transfermd)
- [expired\_account\_notification](#interfacesexpired_account_notificationmd)
- [failed\_recurrent\_transfer](#interfacesfailed_recurrent_transfermd)
- [feed\_publish](#interfacesfeed_publishmd)
- [fill\_collateralized\_convert\_request](#interfacesfill_collateralized_convert_requestmd)
- [fill\_convert\_request](#interfacesfill_convert_requestmd)
- [fill\_order](#interfacesfill_ordermd)
- [fill\_recurrent\_transfer](#interfacesfill_recurrent_transfermd)
- [fill\_transfer\_from\_savings](#interfacesfill_transfer_from_savingsmd)
- [fill\_vesting\_withdraw](#interfacesfill_vesting_withdrawmd)
- [future\_extensions](#interfacesfuture_extensionsmd)
- [hardfork](#interfaceshardforkmd)
- [hardfork\_hive](#interfaceshardfork_hivemd)
- [hardfork\_hive\_restore](#interfaceshardfork_hive_restoremd)
- [ineffective\_delete\_comment](#interfacesineffective_delete_commentmd)
- [interest](#interfacesinterestmd)
- [legacy\_chain\_properties](#interfaceslegacy_chain_propertiesmd)
- [limit\_order\_cancel](#interfaceslimit_order_cancelmd)
- [limit\_order\_cancelled](#interfaceslimit_order_cancelledmd)
- [limit\_order\_create](#interfaceslimit_order_createmd)
- [limit\_order\_create2](#interfaceslimit_order_create2md)
- [liquidity\_reward](#interfacesliquidity_rewardmd)
- [operation](#interfacesoperationmd)
- [pow](#interfacespowmd)
- [pow2](#interfacespow2md)
- [pow\_reward](#interfacespow_rewardmd)
- [price](#interfacespricemd)
- [producer\_missed](#interfacesproducer_missedmd)
- [producer\_reward](#interfacesproducer_rewardmd)
- [proposal\_fee](#interfacesproposal_feemd)
- [proposal\_pay](#interfacesproposal_paymd)
- [proxy\_cleared](#interfacesproxy_clearedmd)
- [recover\_account](#interfacesrecover_accountmd)
- [recurrent\_transfer](#interfacesrecurrent_transfermd)
- [remove\_proposal](#interfacesremove_proposalmd)
- [request\_account\_recovery](#interfacesrequest_account_recoverymd)
- [return\_vesting\_delegation](#interfacesreturn_vesting_delegationmd)
- [set\_withdraw\_vesting\_route](#interfacesset_withdraw_vesting_routemd)
- [shutdown\_witness](#interfacesshutdown_witnessmd)
- [system\_warning](#interfacessystem_warningmd)
- [transaction](#interfacestransactionmd)
- [transfer](#interfacestransfermd)
- [transfer\_from\_savings](#interfacestransfer_from_savingsmd)
- [transfer\_to\_savings](#interfacestransfer_to_savingsmd)
- [transfer\_to\_vesting](#interfacestransfer_to_vestingmd)
- [transfer\_to\_vesting\_completed](#interfacestransfer_to_vesting_completedmd)
- [update\_proposal](#interfacesupdate_proposalmd)
- [update\_proposal\_votes](#interfacesupdate_proposal_votesmd)
- [vesting\_shares\_split](#interfacesvesting_shares_splitmd)
- [vote](#interfacesvotemd)
- [withdraw\_vesting](#interfaceswithdraw_vestingmd)
- [witness\_block\_approve](#interfaceswitness_block_approvemd)
- [witness\_set\_properties](#interfaceswitness_set_propertiesmd)
- [witness\_update](#interfaceswitness_updatemd)

## Type Aliases

### DeepPartial

Ƭ **DeepPartial**\<`T`\>: `T` extends `object` ? \{ [P in keyof T]?: DeepPartial\<T[P]\> } : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

wasm/lib/detailed/formatters/types.ts:6

___

### DeepReadonly

Ƭ **DeepReadonly**\<`T`\>: `T` extends infer R[] ? `DeepReadonlyArray`\<`R`\> : `T` extends `Function` ? `T` : `T` extends `object` ? `DeepReadonlyObject`\<`T`\> : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

wasm/lib/detailed/formatters/types.ts:10

___

### TAccountName

Ƭ **TAccountName**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:5

___

### TBlockHash

Ƭ **TBlockHash**: `ArrayBuffer` \| `Uint8Array` \| `Uint8ClampedArray` \| `Int8Array` \| `string`

Block id type

20 byte string or hex string describing 20 byte array

#### Defined in

wasm/lib/interfaces.ts:30

___

### TCommunityRules

Ƭ **TCommunityRules**: \{ `account`: [`TAccountName`](#taccountname) ; `action`: [`FLAG_POST`](#flag_post) \| [`MUTE_POST`](#mute_post) \| [`UNMUTE_POST`](#unmute_post) ; `notes`: `string` ; `permlink`: `string`  } \| \{ `account`: [`TAccountName`](#taccountname) ; `action`: [`PIN_POST`](#pin_post) \| [`UNPIN_POST`](#unpin_post) ; `permlink`: `string`  } \| \{ `action`: [`SUBSCRIBE`](#subscribe) \| [`UNSUBSCRIBE`](#unsubscribe)  } \| \{ `account`: [`TAccountName`](#taccountname) ; `action`: [`SET_USER_TITLE`](#set_user_title) ; `title`: `string`  } \| \{ `action`: [`UPDATE_PROPS`](#update_props) ; `props`: `Readonly`\<[`ICommunityProps`](#interfacesicommunitypropsmd)\>  }

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:4

___

### TFormatFunction

Ƭ **TFormatFunction**\<`T`\>: (`args`: [`IFormatFunctionArguments`](#interfacesiformatfunctionargumentsmd)\<`T`\>) => `string` \| `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Type declaration

▸ (`args`): `string` \| `any`

Formatter function that receives input value for the matched property and returns the formatted output
Remember that this function takes two arguments. The first one is for data parsing, e.g. for transactions
parsing using [["fromApi"]](interfaces/ITransactionBuilderConstructor.md). That data should mantain immutable.

The second argument is the target working argument which should be returned from the formatter function
if your options specify to ignore given formatting.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | [`IFormatFunctionArguments`](#interfacesiformatfunctionargumentsmd)\<`T`\> | formatter function arguments |

##### Returns

`string` \| `any`

desired formatted output data

**`Example`**

Default formatter for transaction
```typescript
;@WaxFormattable({ matchProperty: "operations" })
public transactionFormatter(source: DeepReadonly<ApiTransaction>, target: object): string | object {
  if(!this.options.transaction.displayAsId)
    return target;

  const { id } = this.wax.TransactionBuilder.fromApi(source);

  return id;
}
```

#### Defined in

wasm/lib/detailed/formatters/types.ts:115

___

### THexString

Ƭ **THexString**: `string`

String in hex format

#### Defined in

wasm/lib/interfaces.ts:23

___

### TInterfaceOperationBuilder

Ƭ **TInterfaceOperationBuilder**\<`T`\>: `T` extends `OperationBuilder` ? `Omit`\<`T`, ``"build"`` \| ``"push"``\> & \{ `api`: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)  } : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

wasm/lib/interfaces.ts:16

___

### TOperationVisitor

Ƭ **TOperationVisitor**\<`R`\>: \{ [K in keyof Required\<operation\>]?: Function }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `void` |

#### Defined in

wasm/lib/visitor.ts:14

___

### TTimestamp

Ƭ **TTimestamp**: `Date` \| `number` \| `string`

#### Defined in

wasm/lib/interfaces.ts:18

___

### TTransactionId

Ƭ **TTransactionId**: `string`

Transaction id type

20 byte string or hex string describing 20 byte array

#### Defined in

wasm/lib/interfaces.ts:60

___

### TWaxApiRequest

Ƭ **TWaxApiRequest**\<`TReq`, `TRes`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `TReq` |
| `TRes` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `params` | `TReq` |
| `result` | `TRes` |

#### Defined in

wasm/lib/interfaces.ts:570

___

### TWaxCustomFormatterConstructor

Ƭ **TWaxCustomFormatterConstructor**: (`wax`: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)) => [`IWaxCustomFormatter`](#interfacesiwaxcustomformattermd) \| () => [`IWaxCustomFormatter`](#interfacesiwaxcustomformattermd)

#### Defined in

wasm/lib/detailed/formatters/types.ts:160

___

### TWaxExtended

Ƭ **TWaxExtended**\<`YourApi`\>: [`IHiveChainInterface`](#interfacesihivechaininterfacemd) & \{ `api`: `IHiveApi` & \{ [k in keyof YourApi]: Readonly\<YourApiData\<YourApi[k]\>\> }  }

#### Type parameters

| Name |
| :------ |
| `YourApi` |

#### Defined in

wasm/lib/interfaces.ts:592

## Variables

### account\_create

• **account\_create**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_create`](#account_create) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_create`](#account_create) |
| `encode` | (`message`: [`account_create`](#account_create), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_create`](#account_create) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_create`](#account_create) |
| `toJSON` | (`message`: [`account_create`](#account_create)) => `unknown` |

#### Defined in

wasm/lib/proto/account_create.ts:24

wasm/lib/proto/account_create.ts:48

___

### account\_create\_with\_delegation

• **account\_create\_with\_delegation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_create_with_delegation`](#account_create_with_delegation) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_create_with_delegation`](#account_create_with_delegation) |
| `encode` | (`message`: [`account_create_with_delegation`](#account_create_with_delegation), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_create_with_delegation`](#account_create_with_delegation) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_create_with_delegation`](#account_create_with_delegation) |
| `toJSON` | (`message`: [`account_create_with_delegation`](#account_create_with_delegation)) => `unknown` |

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:10

wasm/lib/proto/account_create_with_delegation.ts:38

___

### account\_created

• **account\_created**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_created`](#account_created) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_created`](#account_created) |
| `encode` | (`message`: [`account_created`](#account_created), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_created`](#account_created) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_created`](#account_created) |
| `toJSON` | (`message`: [`account_created`](#account_created)) => `unknown` |

#### Defined in

wasm/lib/proto/account_created.ts:18

wasm/lib/proto/account_created.ts:29

___

### account\_update

• **account\_update**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_update`](#account_update) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_update`](#account_update) |
| `encode` | (`message`: [`account_update`](#account_update), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_update`](#account_update) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_update`](#account_update) |
| `toJSON` | (`message`: [`account_update`](#account_update)) => `unknown` |

#### Defined in

wasm/lib/proto/account_update.ts:26

wasm/lib/proto/account_update.ts:39

___

### account\_update2

• **account\_update2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_update2`](#account_update2) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_update2`](#account_update2) |
| `encode` | (`message`: [`account_update2`](#account_update2), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_update2`](#account_update2) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_update2`](#account_update2) |
| `toJSON` | (`message`: [`account_update2`](#account_update2)) => `unknown` |

#### Defined in

wasm/lib/proto/account_update2.ts:53

wasm/lib/proto/account_update2.ts:77

___

### account\_witness\_proxy

• **account\_witness\_proxy**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_witness_proxy`](#account_witness_proxy) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_witness_proxy`](#account_witness_proxy) |
| `encode` | (`message`: [`account_witness_proxy`](#account_witness_proxy), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_witness_proxy`](#account_witness_proxy) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_witness_proxy`](#account_witness_proxy) |
| `toJSON` | (`message`: [`account_witness_proxy`](#account_witness_proxy)) => `unknown` |

#### Defined in

wasm/lib/proto/account_witness_proxy.ts:22

wasm/lib/proto/account_witness_proxy.ts:31

___

### account\_witness\_vote

• **account\_witness\_vote**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`account_witness_vote`](#account_witness_vote) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`account_witness_vote`](#account_witness_vote) |
| `encode` | (`message`: [`account_witness_vote`](#account_witness_vote), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`account_witness_vote`](#account_witness_vote) |
| `fromPartial` | \<I\>(`object`: `I`) => [`account_witness_vote`](#account_witness_vote) |
| `toJSON` | (`message`: [`account_witness_vote`](#account_witness_vote)) => `unknown` |

#### Defined in

wasm/lib/proto/account_witness_vote.ts:21

wasm/lib/proto/account_witness_vote.ts:31

___

### asset

• **asset**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`asset`](#asset) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`asset`](#asset) |
| `encode` | (`message`: [`asset`](#asset), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`asset`](#asset) |
| `fromPartial` | \<I\>(`object`: `I`) => [`asset`](#asset) |
| `toJSON` | (`message`: [`asset`](#asset)) => `unknown` |

#### Defined in

wasm/lib/proto/asset.ts:6

wasm/lib/proto/asset.ts:16

___

### author\_reward

• **author\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`author_reward`](#author_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`author_reward`](#author_reward) |
| `encode` | (`message`: [`author_reward`](#author_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`author_reward`](#author_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`author_reward`](#author_reward) |
| `toJSON` | (`message`: [`author_reward`](#author_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/author_reward.ts:22

wasm/lib/proto/author_reward.ts:44

___

### authority

• **authority**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`authority`](#authority) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`authority`](#authority) |
| `encode` | (`message`: [`authority`](#authority), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`authority`](#authority) |
| `fromPartial` | \<I\>(`object`: `I`) => [`authority`](#authority) |
| `toJSON` | (`message`: [`authority`](#authority)) => `unknown` |

#### Defined in

wasm/lib/proto/authority.ts:6

wasm/lib/proto/authority.ts:26

___

### block

• **block**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`block`](#block) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`block`](#block) |
| `encode` | (`message`: [`block`](#block), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`block`](#block) |
| `fromPartial` | \<I\>(`object`: `I`) => [`block`](#block) |
| `toJSON` | (`message`: [`block`](#block)) => `unknown` |

#### Defined in

wasm/lib/proto/block.ts:19

wasm/lib/proto/block.ts:217

___

### cancel\_transfer\_from\_savings

• **cancel\_transfer\_from\_savings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`cancel_transfer_from_savings`](#cancel_transfer_from_savings) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`cancel_transfer_from_savings`](#cancel_transfer_from_savings) |
| `encode` | (`message`: [`cancel_transfer_from_savings`](#cancel_transfer_from_savings), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`cancel_transfer_from_savings`](#cancel_transfer_from_savings) |
| `fromPartial` | \<I\>(`object`: `I`) => [`cancel_transfer_from_savings`](#cancel_transfer_from_savings) |
| `toJSON` | (`message`: [`cancel_transfer_from_savings`](#cancel_transfer_from_savings)) => `unknown` |

#### Defined in

wasm/lib/proto/cancel_transfer_from_savings.ts:12

wasm/lib/proto/cancel_transfer_from_savings.ts:21

___

### change\_recovery\_account

• **change\_recovery\_account**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`change_recovery_account`](#change_recovery_account) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`change_recovery_account`](#change_recovery_account) |
| `encode` | (`message`: [`change_recovery_account`](#change_recovery_account), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`change_recovery_account`](#change_recovery_account) |
| `fromPartial` | \<I\>(`object`: `I`) => [`change_recovery_account`](#change_recovery_account) |
| `toJSON` | (`message`: [`change_recovery_account`](#change_recovery_account)) => `unknown` |

#### Defined in

wasm/lib/proto/change_recovery_account.ts:20

wasm/lib/proto/change_recovery_account.ts:30

___

### changed\_recovery\_account

• **changed\_recovery\_account**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`changed_recovery_account`](#changed_recovery_account) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`changed_recovery_account`](#changed_recovery_account) |
| `encode` | (`message`: [`changed_recovery_account`](#changed_recovery_account), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`changed_recovery_account`](#changed_recovery_account) |
| `fromPartial` | \<I\>(`object`: `I`) => [`changed_recovery_account`](#changed_recovery_account) |
| `toJSON` | (`message`: [`changed_recovery_account`](#changed_recovery_account)) => `unknown` |

#### Defined in

wasm/lib/proto/changed_recovery_account.ts:14

wasm/lib/proto/changed_recovery_account.ts:24

___

### claim\_account

• **claim\_account**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`claim_account`](#claim_account) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`claim_account`](#claim_account) |
| `encode` | (`message`: [`claim_account`](#claim_account), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`claim_account`](#claim_account) |
| `fromPartial` | \<I\>(`object`: `I`) => [`claim_account`](#claim_account) |
| `toJSON` | (`message`: [`claim_account`](#claim_account)) => `unknown` |

#### Defined in

wasm/lib/proto/claim_account.ts:20

wasm/lib/proto/claim_account.ts:30

___

### claim\_reward\_balance

• **claim\_reward\_balance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`claim_reward_balance`](#claim_reward_balance) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`claim_reward_balance`](#claim_reward_balance) |
| `encode` | (`message`: [`claim_reward_balance`](#claim_reward_balance), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`claim_reward_balance`](#claim_reward_balance) |
| `fromPartial` | \<I\>(`object`: `I`) => [`claim_reward_balance`](#claim_reward_balance) |
| `toJSON` | (`message`: [`claim_reward_balance`](#claim_reward_balance)) => `unknown` |

#### Defined in

wasm/lib/proto/claim_reward_balance.ts:18

wasm/lib/proto/claim_reward_balance.ts:29

___

### clear\_null\_account\_balance

• **clear\_null\_account\_balance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`clear_null_account_balance`](#clear_null_account_balance) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`clear_null_account_balance`](#clear_null_account_balance) |
| `encode` | (`message`: [`clear_null_account_balance`](#clear_null_account_balance), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`clear_null_account_balance`](#clear_null_account_balance) |
| `fromPartial` | \<I\>(`object`: `I`) => [`clear_null_account_balance`](#clear_null_account_balance) |
| `toJSON` | (`message`: [`clear_null_account_balance`](#clear_null_account_balance)) => `unknown` |

#### Defined in

wasm/lib/proto/clear_null_account_balance.ts:14

wasm/lib/proto/clear_null_account_balance.ts:22

___

### collateralized\_convert

• **collateralized\_convert**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`collateralized_convert`](#collateralized_convert) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`collateralized_convert`](#collateralized_convert) |
| `encode` | (`message`: [`collateralized_convert`](#collateralized_convert), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`collateralized_convert`](#collateralized_convert) |
| `fromPartial` | \<I\>(`object`: `I`) => [`collateralized_convert`](#collateralized_convert) |
| `toJSON` | (`message`: [`collateralized_convert`](#collateralized_convert)) => `unknown` |

#### Defined in

wasm/lib/proto/collateralized_convert.ts:17

wasm/lib/proto/collateralized_convert.ts:27

___

### collateralized\_convert\_immediate\_conversion

• **collateralized\_convert\_immediate\_conversion**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion) |
| `encode` | (`message`: [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion) |
| `fromPartial` | \<I\>(`object`: `I`) => [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion) |
| `toJSON` | (`message`: [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion)) => `unknown` |

#### Defined in

wasm/lib/proto/collateralized_convert_immediate_conversion.ts:16

wasm/lib/proto/collateralized_convert_immediate_conversion.ts:26

___

### comment

• **comment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`comment`](#comment) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`comment`](#comment) |
| `encode` | (`message`: [`comment`](#comment), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`comment`](#comment) |
| `fromPartial` | \<I\>(`object`: `I`) => [`comment`](#comment) |
| `toJSON` | (`message`: [`comment`](#comment)) => `unknown` |

#### Defined in

wasm/lib/proto/comment.ts:38

wasm/lib/proto/comment.ts:52

___

### comment\_benefactor\_reward

• **comment\_benefactor\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`comment_benefactor_reward`](#comment_benefactor_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`comment_benefactor_reward`](#comment_benefactor_reward) |
| `encode` | (`message`: [`comment_benefactor_reward`](#comment_benefactor_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`comment_benefactor_reward`](#comment_benefactor_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`comment_benefactor_reward`](#comment_benefactor_reward) |
| `toJSON` | (`message`: [`comment_benefactor_reward`](#comment_benefactor_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:22

wasm/lib/proto/comment_benefactor_reward.ts:44

___

### comment\_options

• **comment\_options**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`comment_options`](#comment_options) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`comment_options`](#comment_options) |
| `encode` | (`message`: [`comment_options`](#comment_options), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`comment_options`](#comment_options) |
| `fromPartial` | \<I\>(`object`: `I`) => [`comment_options`](#comment_options) |
| `toJSON` | (`message`: [`comment_options`](#comment_options)) => `unknown` |

#### Defined in

wasm/lib/proto/comment_options.ts:55

wasm/lib/proto/comment_options.ts:276

___

### comment\_payout\_update

• **comment\_payout\_update**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`comment_payout_update`](#comment_payout_update) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`comment_payout_update`](#comment_payout_update) |
| `encode` | (`message`: [`comment_payout_update`](#comment_payout_update), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`comment_payout_update`](#comment_payout_update) |
| `fromPartial` | \<I\>(`object`: `I`) => [`comment_payout_update`](#comment_payout_update) |
| `toJSON` | (`message`: [`comment_payout_update`](#comment_payout_update)) => `unknown` |

#### Defined in

wasm/lib/proto/comment_payout_update.ts:14

wasm/lib/proto/comment_payout_update.ts:23

___

### comment\_reward

• **comment\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`comment_reward`](#comment_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`comment_reward`](#comment_reward) |
| `encode` | (`message`: [`comment_reward`](#comment_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`comment_reward`](#comment_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`comment_reward`](#comment_reward) |
| `toJSON` | (`message`: [`comment_reward`](#comment_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/comment_reward.ts:24

wasm/lib/proto/comment_reward.ts:46

___

### consolidate\_treasury\_balance

• **consolidate\_treasury\_balance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`consolidate_treasury_balance`](#consolidate_treasury_balance) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`consolidate_treasury_balance`](#consolidate_treasury_balance) |
| `encode` | (`message`: [`consolidate_treasury_balance`](#consolidate_treasury_balance), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`consolidate_treasury_balance`](#consolidate_treasury_balance) |
| `fromPartial` | \<I\>(`object`: `I`) => [`consolidate_treasury_balance`](#consolidate_treasury_balance) |
| `toJSON` | (`message`: [`consolidate_treasury_balance`](#consolidate_treasury_balance)) => `unknown` |

#### Defined in

wasm/lib/proto/consolidate_treasury_balance.ts:15

wasm/lib/proto/consolidate_treasury_balance.ts:23

___

### convert

• **convert**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`convert`](#convert) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`convert`](#convert) |
| `encode` | (`message`: [`convert`](#convert), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`convert`](#convert) |
| `fromPartial` | \<I\>(`object`: `I`) => [`convert`](#convert) |
| `toJSON` | (`message`: [`convert`](#convert)) => `unknown` |

#### Defined in

wasm/lib/proto/convert.ts:15

wasm/lib/proto/convert.ts:25

___

### create\_claimed\_account

• **create\_claimed\_account**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`create_claimed_account`](#create_claimed_account) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`create_claimed_account`](#create_claimed_account) |
| `encode` | (`message`: [`create_claimed_account`](#create_claimed_account), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`create_claimed_account`](#create_claimed_account) |
| `fromPartial` | \<I\>(`object`: `I`) => [`create_claimed_account`](#create_claimed_account) |
| `toJSON` | (`message`: [`create_claimed_account`](#create_claimed_account)) => `unknown` |

#### Defined in

wasm/lib/proto/create_claimed_account.ts:25

wasm/lib/proto/create_claimed_account.ts:49

___

### create\_proposal

• **create\_proposal**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`create_proposal`](#create_proposal) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`create_proposal`](#create_proposal) |
| `encode` | (`message`: [`create_proposal`](#create_proposal), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`create_proposal`](#create_proposal) |
| `fromPartial` | \<I\>(`object`: `I`) => [`create_proposal`](#create_proposal) |
| `toJSON` | (`message`: [`create_proposal`](#create_proposal)) => `unknown` |

#### Defined in

wasm/lib/proto/create_proposal.ts:27

wasm/lib/proto/create_proposal.ts:51

___

### curation\_reward

• **curation\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`curation_reward`](#curation_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`curation_reward`](#curation_reward) |
| `encode` | (`message`: [`curation_reward`](#curation_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`curation_reward`](#curation_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`curation_reward`](#curation_reward) |
| `toJSON` | (`message`: [`curation_reward`](#curation_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/curation_reward.ts:19

wasm/lib/proto/curation_reward.ts:31

___

### custom

• **custom**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`custom`](#custom) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`custom`](#custom) |
| `encode` | (`message`: [`custom`](#custom), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`custom`](#custom) |
| `fromPartial` | \<I\>(`object`: `I`) => [`custom`](#custom) |
| `toJSON` | (`message`: [`custom`](#custom)) => `unknown` |

#### Defined in

wasm/lib/proto/custom.ts:14

wasm/lib/proto/custom.ts:24

___

### custom\_json

• **custom\_json**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`custom_json`](#custom_json) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`custom_json`](#custom_json) |
| `encode` | (`message`: [`custom_json`](#custom_json), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`custom_json`](#custom_json) |
| `fromPartial` | \<I\>(`object`: `I`) => [`custom_json`](#custom_json) |
| `toJSON` | (`message`: [`custom_json`](#custom_json)) => `unknown` |

#### Defined in

wasm/lib/proto/custom_json.ts:22

wasm/lib/proto/custom_json.ts:33

___

### decline\_voting\_rights

• **decline\_voting\_rights**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`decline_voting_rights`](#decline_voting_rights) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`decline_voting_rights`](#decline_voting_rights) |
| `encode` | (`message`: [`decline_voting_rights`](#decline_voting_rights), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`decline_voting_rights`](#decline_voting_rights) |
| `fromPartial` | \<I\>(`object`: `I`) => [`decline_voting_rights`](#decline_voting_rights) |
| `toJSON` | (`message`: [`decline_voting_rights`](#decline_voting_rights)) => `unknown` |

#### Defined in

wasm/lib/proto/decline_voting_rights.ts:18

wasm/lib/proto/decline_voting_rights.ts:27

___

### declined\_voting\_rights

• **declined\_voting\_rights**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`declined_voting_rights`](#declined_voting_rights) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`declined_voting_rights`](#declined_voting_rights) |
| `encode` | (`message`: [`declined_voting_rights`](#declined_voting_rights), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`declined_voting_rights`](#declined_voting_rights) |
| `fromPartial` | \<I\>(`object`: `I`) => [`declined_voting_rights`](#declined_voting_rights) |
| `toJSON` | (`message`: [`declined_voting_rights`](#declined_voting_rights)) => `unknown` |

#### Defined in

wasm/lib/proto/declined_voting_rights.ts:12

wasm/lib/proto/declined_voting_rights.ts:20

___

### delayed\_voting

• **delayed\_voting**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`delayed_voting`](#delayed_voting) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`delayed_voting`](#delayed_voting) |
| `encode` | (`message`: [`delayed_voting`](#delayed_voting), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`delayed_voting`](#delayed_voting) |
| `fromPartial` | \<I\>(`object`: `I`) => [`delayed_voting`](#delayed_voting) |
| `toJSON` | (`message`: [`delayed_voting`](#delayed_voting)) => `unknown` |

#### Defined in

wasm/lib/proto/delayed_voting.ts:16

wasm/lib/proto/delayed_voting.ts:25

___

### delegate\_vesting\_shares

• **delegate\_vesting\_shares**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`delegate_vesting_shares`](#delegate_vesting_shares) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`delegate_vesting_shares`](#delegate_vesting_shares) |
| `encode` | (`message`: [`delegate_vesting_shares`](#delegate_vesting_shares), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`delegate_vesting_shares`](#delegate_vesting_shares) |
| `fromPartial` | \<I\>(`object`: `I`) => [`delegate_vesting_shares`](#delegate_vesting_shares) |
| `toJSON` | (`message`: [`delegate_vesting_shares`](#delegate_vesting_shares)) => `unknown` |

#### Defined in

wasm/lib/proto/delegate_vesting_shares.ts:25

wasm/lib/proto/delegate_vesting_shares.ts:35

___

### delete\_comment

• **delete\_comment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`delete_comment`](#delete_comment) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`delete_comment`](#delete_comment) |
| `encode` | (`message`: [`delete_comment`](#delete_comment), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`delete_comment`](#delete_comment) |
| `fromPartial` | \<I\>(`object`: `I`) => [`delete_comment`](#delete_comment) |
| `toJSON` | (`message`: [`delete_comment`](#delete_comment)) => `unknown` |

#### Defined in

wasm/lib/proto/delete_comment.ts:13

wasm/lib/proto/delete_comment.ts:22

___

### dhf\_conversion

• **dhf\_conversion**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`dhf_conversion`](#dhf_conversion) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`dhf_conversion`](#dhf_conversion) |
| `encode` | (`message`: [`dhf_conversion`](#dhf_conversion), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`dhf_conversion`](#dhf_conversion) |
| `fromPartial` | \<I\>(`object`: `I`) => [`dhf_conversion`](#dhf_conversion) |
| `toJSON` | (`message`: [`dhf_conversion`](#dhf_conversion)) => `unknown` |

#### Defined in

wasm/lib/proto/dhf_conversion.ts:17

wasm/lib/proto/dhf_conversion.ts:27

___

### dhf\_funding

• **dhf\_funding**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`dhf_funding`](#dhf_funding) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`dhf_funding`](#dhf_funding) |
| `encode` | (`message`: [`dhf_funding`](#dhf_funding), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`dhf_funding`](#dhf_funding) |
| `fromPartial` | \<I\>(`object`: `I`) => [`dhf_funding`](#dhf_funding) |
| `toJSON` | (`message`: [`dhf_funding`](#dhf_funding)) => `unknown` |

#### Defined in

wasm/lib/proto/dhf_funding.ts:16

wasm/lib/proto/dhf_funding.ts:25

___

### effective\_comment\_vote

• **effective\_comment\_vote**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`effective_comment_vote`](#effective_comment_vote) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`effective_comment_vote`](#effective_comment_vote) |
| `encode` | (`message`: [`effective_comment_vote`](#effective_comment_vote), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`effective_comment_vote`](#effective_comment_vote) |
| `fromPartial` | \<I\>(`object`: `I`) => [`effective_comment_vote`](#effective_comment_vote) |
| `toJSON` | (`message`: [`effective_comment_vote`](#effective_comment_vote)) => `unknown` |

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:21

wasm/lib/proto/effective_comment_vote.ts:43

___

### escrow\_approve

• **escrow\_approve**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`escrow_approve`](#escrow_approve) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`escrow_approve`](#escrow_approve) |
| `encode` | (`message`: [`escrow_approve`](#escrow_approve), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`escrow_approve`](#escrow_approve) |
| `fromPartial` | \<I\>(`object`: `I`) => [`escrow_approve`](#escrow_approve) |
| `toJSON` | (`message`: [`escrow_approve`](#escrow_approve)) => `unknown` |

#### Defined in

wasm/lib/proto/escrow_approve.ts:21

wasm/lib/proto/escrow_approve.ts:34

___

### escrow\_approved

• **escrow\_approved**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`escrow_approved`](#escrow_approved) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`escrow_approved`](#escrow_approved) |
| `encode` | (`message`: [`escrow_approved`](#escrow_approved), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`escrow_approved`](#escrow_approved) |
| `fromPartial` | \<I\>(`object`: `I`) => [`escrow_approved`](#escrow_approved) |
| `toJSON` | (`message`: [`escrow_approved`](#escrow_approved)) => `unknown` |

#### Defined in

wasm/lib/proto/escrow_approved.ts:18

wasm/lib/proto/escrow_approved.ts:30

___

### escrow\_dispute

• **escrow\_dispute**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`escrow_dispute`](#escrow_dispute) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`escrow_dispute`](#escrow_dispute) |
| `encode` | (`message`: [`escrow_dispute`](#escrow_dispute), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`escrow_dispute`](#escrow_dispute) |
| `fromPartial` | \<I\>(`object`: `I`) => [`escrow_dispute`](#escrow_dispute) |
| `toJSON` | (`message`: [`escrow_dispute`](#escrow_dispute)) => `unknown` |

#### Defined in

wasm/lib/proto/escrow_dispute.ts:16

wasm/lib/proto/escrow_dispute.ts:28

___

### escrow\_rejected

• **escrow\_rejected**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`escrow_rejected`](#escrow_rejected) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`escrow_rejected`](#escrow_rejected) |
| `encode` | (`message`: [`escrow_rejected`](#escrow_rejected), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`escrow_rejected`](#escrow_rejected) |
| `fromPartial` | \<I\>(`object`: `I`) => [`escrow_rejected`](#escrow_rejected) |
| `toJSON` | (`message`: [`escrow_rejected`](#escrow_rejected)) => `unknown` |

#### Defined in

wasm/lib/proto/escrow_rejected.ts:22

wasm/lib/proto/escrow_rejected.ts:44

___

### escrow\_release

• **escrow\_release**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`escrow_release`](#escrow_release) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`escrow_release`](#escrow_release) |
| `encode` | (`message`: [`escrow_release`](#escrow_release), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`escrow_release`](#escrow_release) |
| `fromPartial` | \<I\>(`object`: `I`) => [`escrow_release`](#escrow_release) |
| `toJSON` | (`message`: [`escrow_release`](#escrow_release)) => `unknown` |

#### Defined in

wasm/lib/proto/escrow_release.ts:24

wasm/lib/proto/escrow_release.ts:48

___

### escrow\_transfer

• **escrow\_transfer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`escrow_transfer`](#escrow_transfer) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`escrow_transfer`](#escrow_transfer) |
| `encode` | (`message`: [`escrow_transfer`](#escrow_transfer), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`escrow_transfer`](#escrow_transfer) |
| `fromPartial` | \<I\>(`object`: `I`) => [`escrow_transfer`](#escrow_transfer) |
| `toJSON` | (`message`: [`escrow_transfer`](#escrow_transfer)) => `unknown` |

#### Defined in

wasm/lib/proto/escrow_transfer.ts:32

wasm/lib/proto/escrow_transfer.ts:60

___

### expired\_account\_notification

• **expired\_account\_notification**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`expired_account_notification`](#expired_account_notification) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`expired_account_notification`](#expired_account_notification) |
| `encode` | (`message`: [`expired_account_notification`](#expired_account_notification), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`expired_account_notification`](#expired_account_notification) |
| `fromPartial` | \<I\>(`object`: `I`) => [`expired_account_notification`](#expired_account_notification) |
| `toJSON` | (`message`: [`expired_account_notification`](#expired_account_notification)) => `unknown` |

#### Defined in

wasm/lib/proto/expired_account_notification.ts:13

wasm/lib/proto/expired_account_notification.ts:21

___

### failed\_recurrent\_transfer

• **failed\_recurrent\_transfer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`failed_recurrent_transfer`](#failed_recurrent_transfer) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`failed_recurrent_transfer`](#failed_recurrent_transfer) |
| `encode` | (`message`: [`failed_recurrent_transfer`](#failed_recurrent_transfer), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`failed_recurrent_transfer`](#failed_recurrent_transfer) |
| `fromPartial` | \<I\>(`object`: `I`) => [`failed_recurrent_transfer`](#failed_recurrent_transfer) |
| `toJSON` | (`message`: [`failed_recurrent_transfer`](#failed_recurrent_transfer)) => `unknown` |

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:22

wasm/lib/proto/failed_recurrent_transfer.ts:44

___

### feed\_publish

• **feed\_publish**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`feed_publish`](#feed_publish) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`feed_publish`](#feed_publish) |
| `encode` | (`message`: [`feed_publish`](#feed_publish), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`feed_publish`](#feed_publish) |
| `fromPartial` | \<I\>(`object`: `I`) => [`feed_publish`](#feed_publish) |
| `toJSON` | (`message`: [`feed_publish`](#feed_publish)) => `unknown` |

#### Defined in

wasm/lib/proto/feed_publish.ts:16

wasm/lib/proto/feed_publish.ts:25

___

### fill\_collateralized\_convert\_request

• **fill\_collateralized\_convert\_request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`fill_collateralized_convert_request`](#fill_collateralized_convert_request) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`fill_collateralized_convert_request`](#fill_collateralized_convert_request) |
| `encode` | (`message`: [`fill_collateralized_convert_request`](#fill_collateralized_convert_request), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`fill_collateralized_convert_request`](#fill_collateralized_convert_request) |
| `fromPartial` | \<I\>(`object`: `I`) => [`fill_collateralized_convert_request`](#fill_collateralized_convert_request) |
| `toJSON` | (`message`: [`fill_collateralized_convert_request`](#fill_collateralized_convert_request)) => `unknown` |

#### Defined in

wasm/lib/proto/fill_collateralized_convert_request.ts:20

wasm/lib/proto/fill_collateralized_convert_request.ts:32

___

### fill\_convert\_request

• **fill\_convert\_request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`fill_convert_request`](#fill_convert_request) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`fill_convert_request`](#fill_convert_request) |
| `encode` | (`message`: [`fill_convert_request`](#fill_convert_request), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`fill_convert_request`](#fill_convert_request) |
| `fromPartial` | \<I\>(`object`: `I`) => [`fill_convert_request`](#fill_convert_request) |
| `toJSON` | (`message`: [`fill_convert_request`](#fill_convert_request)) => `unknown` |

#### Defined in

wasm/lib/proto/fill_convert_request.ts:16

wasm/lib/proto/fill_convert_request.ts:27

___

### fill\_order

• **fill\_order**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`fill_order`](#fill_order) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`fill_order`](#fill_order) |
| `encode` | (`message`: [`fill_order`](#fill_order), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`fill_order`](#fill_order) |
| `fromPartial` | \<I\>(`object`: `I`) => [`fill_order`](#fill_order) |
| `toJSON` | (`message`: [`fill_order`](#fill_order)) => `unknown` |

#### Defined in

wasm/lib/proto/fill_order.ts:19

wasm/lib/proto/fill_order.ts:39

___

### fill\_recurrent\_transfer

• **fill\_recurrent\_transfer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`fill_recurrent_transfer`](#fill_recurrent_transfer) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`fill_recurrent_transfer`](#fill_recurrent_transfer) |
| `encode` | (`message`: [`fill_recurrent_transfer`](#fill_recurrent_transfer), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`fill_recurrent_transfer`](#fill_recurrent_transfer) |
| `fromPartial` | \<I\>(`object`: `I`) => [`fill_recurrent_transfer`](#fill_recurrent_transfer) |
| `toJSON` | (`message`: [`fill_recurrent_transfer`](#fill_recurrent_transfer)) => `unknown` |

#### Defined in

wasm/lib/proto/fill_recurrent_transfer.ts:21

wasm/lib/proto/fill_recurrent_transfer.ts:33

___

### fill\_transfer\_from\_savings

• **fill\_transfer\_from\_savings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`fill_transfer_from_savings`](#fill_transfer_from_savings) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`fill_transfer_from_savings`](#fill_transfer_from_savings) |
| `encode` | (`message`: [`fill_transfer_from_savings`](#fill_transfer_from_savings), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`fill_transfer_from_savings`](#fill_transfer_from_savings) |
| `fromPartial` | \<I\>(`object`: `I`) => [`fill_transfer_from_savings`](#fill_transfer_from_savings) |
| `toJSON` | (`message`: [`fill_transfer_from_savings`](#fill_transfer_from_savings)) => `unknown` |

#### Defined in

wasm/lib/proto/fill_transfer_from_savings.ts:18

wasm/lib/proto/fill_transfer_from_savings.ts:30

___

### fill\_vesting\_withdraw

• **fill\_vesting\_withdraw**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`fill_vesting_withdraw`](#fill_vesting_withdraw) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`fill_vesting_withdraw`](#fill_vesting_withdraw) |
| `encode` | (`message`: [`fill_vesting_withdraw`](#fill_vesting_withdraw), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`fill_vesting_withdraw`](#fill_vesting_withdraw) |
| `fromPartial` | \<I\>(`object`: `I`) => [`fill_vesting_withdraw`](#fill_vesting_withdraw) |
| `toJSON` | (`message`: [`fill_vesting_withdraw`](#fill_vesting_withdraw)) => `unknown` |

#### Defined in

wasm/lib/proto/fill_vesting_withdraw.ts:18

wasm/lib/proto/fill_vesting_withdraw.ts:29

___

### future\_extensions

• **future\_extensions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`future_extensions`](#future_extensions) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`future_extensions`](#future_extensions) |
| `encode` | (`message`: [`future_extensions`](#future_extensions), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`future_extensions`](#future_extensions) |
| `fromPartial` | \<I\>(`object`: `I`) => [`future_extensions`](#future_extensions) |
| `toJSON` | (`message`: [`future_extensions`](#future_extensions)) => `unknown` |

#### Defined in

wasm/lib/proto/future_extensions.ts:9

wasm/lib/proto/future_extensions.ts:60

___

### hardfork

• **hardfork**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`hardfork`](#hardfork) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`hardfork`](#hardfork) |
| `encode` | (`message`: [`hardfork`](#hardfork), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`hardfork`](#hardfork) |
| `fromPartial` | \<I\>(`object`: `I`) => [`hardfork`](#hardfork) |
| `toJSON` | (`message`: [`hardfork`](#hardfork)) => `unknown` |

#### Defined in

wasm/lib/proto/hardfork.ts:12

wasm/lib/proto/hardfork.ts:20

___

### hardfork\_hive

• **hardfork\_hive**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`hardfork_hive`](#hardfork_hive) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`hardfork_hive`](#hardfork_hive) |
| `encode` | (`message`: [`hardfork_hive`](#hardfork_hive), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`hardfork_hive`](#hardfork_hive) |
| `fromPartial` | \<I\>(`object`: `I`) => [`hardfork_hive`](#hardfork_hive) |
| `toJSON` | (`message`: [`hardfork_hive`](#hardfork_hive)) => `unknown` |

#### Defined in

wasm/lib/proto/hardfork_hive.ts:19

wasm/lib/proto/hardfork_hive.ts:41

___

### hardfork\_hive\_restore

• **hardfork\_hive\_restore**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`hardfork_hive_restore`](#hardfork_hive_restore) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`hardfork_hive_restore`](#hardfork_hive_restore) |
| `encode` | (`message`: [`hardfork_hive_restore`](#hardfork_hive_restore), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`hardfork_hive_restore`](#hardfork_hive_restore) |
| `fromPartial` | \<I\>(`object`: `I`) => [`hardfork_hive_restore`](#hardfork_hive_restore) |
| `toJSON` | (`message`: [`hardfork_hive_restore`](#hardfork_hive_restore)) => `unknown` |

#### Defined in

wasm/lib/proto/hardfork_hive_restore.ts:19

wasm/lib/proto/hardfork_hive_restore.ts:30

___

### ineffective\_delete\_comment

• **ineffective\_delete\_comment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`ineffective_delete_comment`](#ineffective_delete_comment) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`ineffective_delete_comment`](#ineffective_delete_comment) |
| `encode` | (`message`: [`ineffective_delete_comment`](#ineffective_delete_comment), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`ineffective_delete_comment`](#ineffective_delete_comment) |
| `fromPartial` | \<I\>(`object`: `I`) => [`ineffective_delete_comment`](#ineffective_delete_comment) |
| `toJSON` | (`message`: [`ineffective_delete_comment`](#ineffective_delete_comment)) => `unknown` |

#### Defined in

wasm/lib/proto/ineffective_delete_comment.ts:15

wasm/lib/proto/ineffective_delete_comment.ts:24

___

### interest

• **interest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`interest`](#interest) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`interest`](#interest) |
| `encode` | (`message`: [`interest`](#interest), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`interest`](#interest) |
| `fromPartial` | \<I\>(`object`: `I`) => [`interest`](#interest) |
| `toJSON` | (`message`: [`interest`](#interest)) => `unknown` |

#### Defined in

wasm/lib/proto/interest.ts:17

wasm/lib/proto/interest.ts:27

___

### legacy\_chain\_properties

• **legacy\_chain\_properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`legacy_chain_properties`](#legacy_chain_properties) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`legacy_chain_properties`](#legacy_chain_properties) |
| `encode` | (`message`: [`legacy_chain_properties`](#legacy_chain_properties), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`legacy_chain_properties`](#legacy_chain_properties) |
| `fromPartial` | \<I\>(`object`: `I`) => [`legacy_chain_properties`](#legacy_chain_properties) |
| `toJSON` | (`message`: [`legacy_chain_properties`](#legacy_chain_properties)) => `unknown` |

#### Defined in

wasm/lib/proto/legacy_chain_properties.ts:19

wasm/lib/proto/legacy_chain_properties.ts:29

___

### limit\_order\_cancel

• **limit\_order\_cancel**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`limit_order_cancel`](#limit_order_cancel) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`limit_order_cancel`](#limit_order_cancel) |
| `encode` | (`message`: [`limit_order_cancel`](#limit_order_cancel), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`limit_order_cancel`](#limit_order_cancel) |
| `fromPartial` | \<I\>(`object`: `I`) => [`limit_order_cancel`](#limit_order_cancel) |
| `toJSON` | (`message`: [`limit_order_cancel`](#limit_order_cancel)) => `unknown` |

#### Defined in

wasm/lib/proto/limit_order_cancel.ts:14

wasm/lib/proto/limit_order_cancel.ts:23

___

### limit\_order\_cancelled

• **limit\_order\_cancelled**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`limit_order_cancelled`](#limit_order_cancelled) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`limit_order_cancelled`](#limit_order_cancelled) |
| `encode` | (`message`: [`limit_order_cancelled`](#limit_order_cancelled), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`limit_order_cancelled`](#limit_order_cancelled) |
| `fromPartial` | \<I\>(`object`: `I`) => [`limit_order_cancelled`](#limit_order_cancelled) |
| `toJSON` | (`message`: [`limit_order_cancelled`](#limit_order_cancelled)) => `unknown` |

#### Defined in

wasm/lib/proto/limit_order_cancelled.ts:18

wasm/lib/proto/limit_order_cancelled.ts:28

___

### limit\_order\_create

• **limit\_order\_create**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`limit_order_create`](#limit_order_create) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`limit_order_create`](#limit_order_create) |
| `encode` | (`message`: [`limit_order_create`](#limit_order_create), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`limit_order_create`](#limit_order_create) |
| `fromPartial` | \<I\>(`object`: `I`) => [`limit_order_create`](#limit_order_create) |
| `toJSON` | (`message`: [`limit_order_create`](#limit_order_create)) => `unknown` |

#### Defined in

wasm/lib/proto/limit_order_create.ts:27

wasm/lib/proto/limit_order_create.ts:47

___

### limit\_order\_create2

• **limit\_order\_create2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`limit_order_create2`](#limit_order_create2) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`limit_order_create2`](#limit_order_create2) |
| `encode` | (`message`: [`limit_order_create2`](#limit_order_create2), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`limit_order_create2`](#limit_order_create2) |
| `fromPartial` | \<I\>(`object`: `I`) => [`limit_order_create2`](#limit_order_create2) |
| `toJSON` | (`message`: [`limit_order_create2`](#limit_order_create2)) => `unknown` |

#### Defined in

wasm/lib/proto/limit_order_create2.ts:23

wasm/lib/proto/limit_order_create2.ts:43

___

### liquidity\_reward

• **liquidity\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`liquidity_reward`](#liquidity_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`liquidity_reward`](#liquidity_reward) |
| `encode` | (`message`: [`liquidity_reward`](#liquidity_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`liquidity_reward`](#liquidity_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`liquidity_reward`](#liquidity_reward) |
| `toJSON` | (`message`: [`liquidity_reward`](#liquidity_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/liquidity_reward.ts:16

wasm/lib/proto/liquidity_reward.ts:25

___

### operation

• **operation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`operation`](#operation) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`operation`](#operation) |
| `encode` | (`message`: [`operation`](#operation), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`operation`](#operation) |
| `fromPartial` | \<I\>(`object`: `I`) => [`operation`](#operation) |
| `toJSON` | (`message`: [`operation`](#operation)) => `unknown` |

#### Defined in

wasm/lib/proto/operation.ts:100

wasm/lib/proto/operation.ts:200

___

### pow

• **pow**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`pow`](#pow) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`pow`](#pow) |
| `encode` | (`message`: [`pow`](#pow), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`pow`](#pow) |
| `fromPartial` | \<I\>(`object`: `I`) => [`pow`](#pow) |
| `toJSON` | (`message`: [`pow`](#pow)) => `unknown` |

#### Defined in

wasm/lib/proto/pow.ts:15

wasm/lib/proto/pow.ts:131

___

### pow2

• **pow2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`pow2`](#pow2) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`pow2`](#pow2) |
| `encode` | (`message`: [`pow2`](#pow2), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`pow2`](#pow2) |
| `fromPartial` | \<I\>(`object`: `I`) => [`pow2`](#pow2) |
| `toJSON` | (`message`: [`pow2`](#pow2)) => `unknown` |

#### Defined in

wasm/lib/proto/pow2.ts:38

wasm/lib/proto/pow2.ts:513

___

### pow\_reward

• **pow\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`pow_reward`](#pow_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`pow_reward`](#pow_reward) |
| `encode` | (`message`: [`pow_reward`](#pow_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`pow_reward`](#pow_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`pow_reward`](#pow_reward) |
| `toJSON` | (`message`: [`pow_reward`](#pow_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/pow_reward.ts:15

wasm/lib/proto/pow_reward.ts:24

___

### price

• **price**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`price`](#price) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`price`](#price) |
| `encode` | (`message`: [`price`](#price), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`price`](#price) |
| `fromPartial` | \<I\>(`object`: `I`) => [`price`](#price) |
| `toJSON` | (`message`: [`price`](#price)) => `unknown` |

#### Defined in

wasm/lib/proto/price.ts:22

wasm/lib/proto/price.ts:31

___

### producer\_missed

• **producer\_missed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`producer_missed`](#producer_missed) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`producer_missed`](#producer_missed) |
| `encode` | (`message`: [`producer_missed`](#producer_missed), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`producer_missed`](#producer_missed) |
| `fromPartial` | \<I\>(`object`: `I`) => [`producer_missed`](#producer_missed) |
| `toJSON` | (`message`: [`producer_missed`](#producer_missed)) => `unknown` |

#### Defined in

wasm/lib/proto/producer_missed.ts:13

wasm/lib/proto/producer_missed.ts:21

___

### producer\_reward

• **producer\_reward**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`producer_reward`](#producer_reward) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`producer_reward`](#producer_reward) |
| `encode` | (`message`: [`producer_reward`](#producer_reward), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`producer_reward`](#producer_reward) |
| `fromPartial` | \<I\>(`object`: `I`) => [`producer_reward`](#producer_reward) |
| `toJSON` | (`message`: [`producer_reward`](#producer_reward)) => `unknown` |

#### Defined in

wasm/lib/proto/producer_reward.ts:14

wasm/lib/proto/producer_reward.ts:23

___

### proposal\_fee

• **proposal\_fee**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`proposal_fee`](#proposal_fee) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`proposal_fee`](#proposal_fee) |
| `encode` | (`message`: [`proposal_fee`](#proposal_fee), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`proposal_fee`](#proposal_fee) |
| `fromPartial` | \<I\>(`object`: `I`) => [`proposal_fee`](#proposal_fee) |
| `toJSON` | (`message`: [`proposal_fee`](#proposal_fee)) => `unknown` |

#### Defined in

wasm/lib/proto/proposal_fee.ts:16

wasm/lib/proto/proposal_fee.ts:27

___

### proposal\_pay

• **proposal\_pay**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`proposal_pay`](#proposal_pay) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`proposal_pay`](#proposal_pay) |
| `encode` | (`message`: [`proposal_pay`](#proposal_pay), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`proposal_pay`](#proposal_pay) |
| `fromPartial` | \<I\>(`object`: `I`) => [`proposal_pay`](#proposal_pay) |
| `toJSON` | (`message`: [`proposal_pay`](#proposal_pay)) => `unknown` |

#### Defined in

wasm/lib/proto/proposal_pay.ts:17

wasm/lib/proto/proposal_pay.ts:28

___

### proxy\_cleared

• **proxy\_cleared**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`proxy_cleared`](#proxy_cleared) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`proxy_cleared`](#proxy_cleared) |
| `encode` | (`message`: [`proxy_cleared`](#proxy_cleared), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`proxy_cleared`](#proxy_cleared) |
| `fromPartial` | \<I\>(`object`: `I`) => [`proxy_cleared`](#proxy_cleared) |
| `toJSON` | (`message`: [`proxy_cleared`](#proxy_cleared)) => `unknown` |

#### Defined in

wasm/lib/proto/proxy_cleared.ts:27

wasm/lib/proto/proxy_cleared.ts:36

___

### recover\_account

• **recover\_account**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`recover_account`](#recover_account) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`recover_account`](#recover_account) |
| `encode` | (`message`: [`recover_account`](#recover_account), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`recover_account`](#recover_account) |
| `fromPartial` | \<I\>(`object`: `I`) => [`recover_account`](#recover_account) |
| `toJSON` | (`message`: [`recover_account`](#recover_account)) => `unknown` |

#### Defined in

wasm/lib/proto/recover_account.ts:24

wasm/lib/proto/recover_account.ts:35

___

### recurrent\_transfer

• **recurrent\_transfer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`recurrent_transfer`](#recurrent_transfer) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`recurrent_transfer`](#recurrent_transfer) |
| `encode` | (`message`: [`recurrent_transfer`](#recurrent_transfer), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`recurrent_transfer`](#recurrent_transfer) |
| `fromPartial` | \<I\>(`object`: `I`) => [`recurrent_transfer`](#recurrent_transfer) |
| `toJSON` | (`message`: [`recurrent_transfer`](#recurrent_transfer)) => `unknown` |

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:48

wasm/lib/proto/recurrent_transfer.ts:208

___

### remove\_proposal

• **remove\_proposal**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`remove_proposal`](#remove_proposal) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`remove_proposal`](#remove_proposal) |
| `encode` | (`message`: [`remove_proposal`](#remove_proposal), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`remove_proposal`](#remove_proposal) |
| `fromPartial` | \<I\>(`object`: `I`) => [`remove_proposal`](#remove_proposal) |
| `toJSON` | (`message`: [`remove_proposal`](#remove_proposal)) => `unknown` |

#### Defined in

wasm/lib/proto/remove_proposal.ts:15

wasm/lib/proto/remove_proposal.ts:25

___

### request\_account\_recovery

• **request\_account\_recovery**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`request_account_recovery`](#request_account_recovery) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`request_account_recovery`](#request_account_recovery) |
| `encode` | (`message`: [`request_account_recovery`](#request_account_recovery), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`request_account_recovery`](#request_account_recovery) |
| `fromPartial` | \<I\>(`object`: `I`) => [`request_account_recovery`](#request_account_recovery) |
| `toJSON` | (`message`: [`request_account_recovery`](#request_account_recovery)) => `unknown` |

#### Defined in

wasm/lib/proto/request_account_recovery.ts:48

wasm/lib/proto/request_account_recovery.ts:59

___

### return\_vesting\_delegation

• **return\_vesting\_delegation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`return_vesting_delegation`](#return_vesting_delegation) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`return_vesting_delegation`](#return_vesting_delegation) |
| `encode` | (`message`: [`return_vesting_delegation`](#return_vesting_delegation), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`return_vesting_delegation`](#return_vesting_delegation) |
| `fromPartial` | \<I\>(`object`: `I`) => [`return_vesting_delegation`](#return_vesting_delegation) |
| `toJSON` | (`message`: [`return_vesting_delegation`](#return_vesting_delegation)) => `unknown` |

#### Defined in

wasm/lib/proto/return_vesting_delegation.ts:15

wasm/lib/proto/return_vesting_delegation.ts:24

___

### set\_withdraw\_vesting\_route

• **set\_withdraw\_vesting\_route**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`set_withdraw_vesting_route`](#set_withdraw_vesting_route) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`set_withdraw_vesting_route`](#set_withdraw_vesting_route) |
| `encode` | (`message`: [`set_withdraw_vesting_route`](#set_withdraw_vesting_route), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`set_withdraw_vesting_route`](#set_withdraw_vesting_route) |
| `fromPartial` | \<I\>(`object`: `I`) => [`set_withdraw_vesting_route`](#set_withdraw_vesting_route) |
| `toJSON` | (`message`: [`set_withdraw_vesting_route`](#set_withdraw_vesting_route)) => `unknown` |

#### Defined in

wasm/lib/proto/set_withdraw_vesting_route.ts:26

wasm/lib/proto/set_withdraw_vesting_route.ts:37

___

### shutdown\_witness

• **shutdown\_witness**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`shutdown_witness`](#shutdown_witness) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`shutdown_witness`](#shutdown_witness) |
| `encode` | (`message`: [`shutdown_witness`](#shutdown_witness), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`shutdown_witness`](#shutdown_witness) |
| `fromPartial` | \<I\>(`object`: `I`) => [`shutdown_witness`](#shutdown_witness) |
| `toJSON` | (`message`: [`shutdown_witness`](#shutdown_witness)) => `unknown` |

#### Defined in

wasm/lib/proto/shutdown_witness.ts:14

wasm/lib/proto/shutdown_witness.ts:22

___

### system\_warning

• **system\_warning**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`system_warning`](#system_warning) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`system_warning`](#system_warning) |
| `encode` | (`message`: [`system_warning`](#system_warning), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`system_warning`](#system_warning) |
| `fromPartial` | \<I\>(`object`: `I`) => [`system_warning`](#system_warning) |
| `toJSON` | (`message`: [`system_warning`](#system_warning)) => `unknown` |

#### Defined in

wasm/lib/proto/system_warning.ts:22

wasm/lib/proto/system_warning.ts:30

___

### transaction

• **transaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`transaction`](#transaction) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`transaction`](#transaction) |
| `encode` | (`message`: [`transaction`](#transaction), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`transaction`](#transaction) |
| `fromPartial` | \<I\>(`object`: `I`) => [`transaction`](#transaction) |
| `toJSON` | (`message`: [`transaction`](#transaction)) => `unknown` |

#### Defined in

wasm/lib/proto/transaction.ts:8

wasm/lib/proto/transaction.ts:22

___

### transfer

• **transfer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`transfer`](#transfer) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`transfer`](#transfer) |
| `encode` | (`message`: [`transfer`](#transfer), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`transfer`](#transfer) |
| `fromPartial` | \<I\>(`object`: `I`) => [`transfer`](#transfer) |
| `toJSON` | (`message`: [`transfer`](#transfer)) => `unknown` |

#### Defined in

wasm/lib/proto/transfer.ts:19

wasm/lib/proto/transfer.ts:30

___

### transfer\_from\_savings

• **transfer\_from\_savings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`transfer_from_savings`](#transfer_from_savings) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`transfer_from_savings`](#transfer_from_savings) |
| `encode` | (`message`: [`transfer_from_savings`](#transfer_from_savings), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`transfer_from_savings`](#transfer_from_savings) |
| `fromPartial` | \<I\>(`object`: `I`) => [`transfer_from_savings`](#transfer_from_savings) |
| `toJSON` | (`message`: [`transfer_from_savings`](#transfer_from_savings)) => `unknown` |

#### Defined in

wasm/lib/proto/transfer_from_savings.ts:16

wasm/lib/proto/transfer_from_savings.ts:28

___

### transfer\_to\_savings

• **transfer\_to\_savings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`transfer_to_savings`](#transfer_to_savings) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`transfer_to_savings`](#transfer_to_savings) |
| `encode` | (`message`: [`transfer_to_savings`](#transfer_to_savings), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`transfer_to_savings`](#transfer_to_savings) |
| `fromPartial` | \<I\>(`object`: `I`) => [`transfer_to_savings`](#transfer_to_savings) |
| `toJSON` | (`message`: [`transfer_to_savings`](#transfer_to_savings)) => `unknown` |

#### Defined in

wasm/lib/proto/transfer_to_savings.ts:21

wasm/lib/proto/transfer_to_savings.ts:32

___

### transfer\_to\_vesting

• **transfer\_to\_vesting**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`transfer_to_vesting`](#transfer_to_vesting) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`transfer_to_vesting`](#transfer_to_vesting) |
| `encode` | (`message`: [`transfer_to_vesting`](#transfer_to_vesting), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`transfer_to_vesting`](#transfer_to_vesting) |
| `fromPartial` | \<I\>(`object`: `I`) => [`transfer_to_vesting`](#transfer_to_vesting) |
| `toJSON` | (`message`: [`transfer_to_vesting`](#transfer_to_vesting)) => `unknown` |

#### Defined in

wasm/lib/proto/transfer_to_vesting.ts:20

wasm/lib/proto/transfer_to_vesting.ts:30

___

### transfer\_to\_vesting\_completed

• **transfer\_to\_vesting\_completed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`transfer_to_vesting_completed`](#transfer_to_vesting_completed) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`transfer_to_vesting_completed`](#transfer_to_vesting_completed) |
| `encode` | (`message`: [`transfer_to_vesting_completed`](#transfer_to_vesting_completed), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`transfer_to_vesting_completed`](#transfer_to_vesting_completed) |
| `fromPartial` | \<I\>(`object`: `I`) => [`transfer_to_vesting_completed`](#transfer_to_vesting_completed) |
| `toJSON` | (`message`: [`transfer_to_vesting_completed`](#transfer_to_vesting_completed)) => `unknown` |

#### Defined in

wasm/lib/proto/transfer_to_vesting_completed.ts:19

wasm/lib/proto/transfer_to_vesting_completed.ts:30

___

### update\_proposal

• **update\_proposal**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`update_proposal`](#update_proposal) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`update_proposal`](#update_proposal) |
| `encode` | (`message`: [`update_proposal`](#update_proposal), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`update_proposal`](#update_proposal) |
| `fromPartial` | \<I\>(`object`: `I`) => [`update_proposal`](#update_proposal) |
| `toJSON` | (`message`: [`update_proposal`](#update_proposal)) => `unknown` |

#### Defined in

wasm/lib/proto/update_proposal.ts:30

wasm/lib/proto/update_proposal.ts:181

___

### update\_proposal\_votes

• **update\_proposal\_votes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`update_proposal_votes`](#update_proposal_votes) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`update_proposal_votes`](#update_proposal_votes) |
| `encode` | (`message`: [`update_proposal_votes`](#update_proposal_votes), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`update_proposal_votes`](#update_proposal_votes) |
| `fromPartial` | \<I\>(`object`: `I`) => [`update_proposal_votes`](#update_proposal_votes) |
| `toJSON` | (`message`: [`update_proposal_votes`](#update_proposal_votes)) => `unknown` |

#### Defined in

wasm/lib/proto/update_proposal_votes.ts:26

wasm/lib/proto/update_proposal_votes.ts:37

___

### vesting\_shares\_split

• **vesting\_shares\_split**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`vesting_shares_split`](#vesting_shares_split) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`vesting_shares_split`](#vesting_shares_split) |
| `encode` | (`message`: [`vesting_shares_split`](#vesting_shares_split), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`vesting_shares_split`](#vesting_shares_split) |
| `fromPartial` | \<I\>(`object`: `I`) => [`vesting_shares_split`](#vesting_shares_split) |
| `toJSON` | (`message`: [`vesting_shares_split`](#vesting_shares_split)) => `unknown` |

#### Defined in

wasm/lib/proto/vesting_shares_split.ts:17

wasm/lib/proto/vesting_shares_split.ts:27

___

### vote

• **vote**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`vote`](#vote) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`vote`](#vote) |
| `encode` | (`message`: [`vote`](#vote), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`vote`](#vote) |
| `fromPartial` | \<I\>(`object`: `I`) => [`vote`](#vote) |
| `toJSON` | (`message`: [`vote`](#vote)) => `unknown` |

#### Defined in

wasm/lib/proto/vote.ts:49

wasm/lib/proto/vote.ts:60

___

### withdraw\_vesting

• **withdraw\_vesting**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`withdraw_vesting`](#withdraw_vesting) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`withdraw_vesting`](#withdraw_vesting) |
| `encode` | (`message`: [`withdraw_vesting`](#withdraw_vesting), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`withdraw_vesting`](#withdraw_vesting) |
| `fromPartial` | \<I\>(`object`: `I`) => [`withdraw_vesting`](#withdraw_vesting) |
| `toJSON` | (`message`: [`withdraw_vesting`](#withdraw_vesting)) => `unknown` |

#### Defined in

wasm/lib/proto/withdraw_vesting.ts:22

wasm/lib/proto/withdraw_vesting.ts:31

___

### witness\_block\_approve

• **witness\_block\_approve**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`witness_block_approve`](#witness_block_approve) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`witness_block_approve`](#witness_block_approve) |
| `encode` | (`message`: [`witness_block_approve`](#witness_block_approve), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`witness_block_approve`](#witness_block_approve) |
| `fromPartial` | \<I\>(`object`: `I`) => [`witness_block_approve`](#witness_block_approve) |
| `toJSON` | (`message`: [`witness_block_approve`](#witness_block_approve)) => `unknown` |

#### Defined in

wasm/lib/proto/witness_block_approve.ts:14

wasm/lib/proto/witness_block_approve.ts:23

___

### witness\_set\_properties

• **witness\_set\_properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`witness_set_properties`](#witness_set_properties) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`witness_set_properties`](#witness_set_properties) |
| `encode` | (`message`: [`witness_set_properties`](#witness_set_properties), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`witness_set_properties`](#witness_set_properties) |
| `fromPartial` | \<I\>(`object`: `I`) => [`witness_set_properties`](#witness_set_properties) |
| `toJSON` | (`message`: [`witness_set_properties`](#witness_set_properties)) => `unknown` |

#### Defined in

wasm/lib/proto/witness_set_properties.ts:19

wasm/lib/proto/witness_set_properties.ts:34

___

### witness\_update

• **witness\_update**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`witness_update`](#witness_update) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`witness_update`](#witness_update) |
| `encode` | (`message`: [`witness_update`](#witness_update), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`witness_update`](#witness_update) |
| `fromPartial` | \<I\>(`object`: `I`) => [`witness_update`](#witness_update) |
| `toJSON` | (`message`: [`witness_update`](#witness_update)) => `unknown` |

#### Defined in

wasm/lib/proto/witness_update.ts:24

wasm/lib/proto/witness_update.ts:36

## Functions

### WaxFormattable

▸ **WaxFormattable**(`options?`): `TWaxFormatterDecorator`

When used on method, marks that this method is intended to be used for wax formatting with given property matching.
When no options provided, method name is used for property matching

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `string` \| `IWaxFormatterDecoratorOptions`\<`any`\> | property to match or decorator options |

#### Returns

`TWaxFormatterDecorator`

**`Example`**

Simple wax decorator usage
```typescript
;@WaxFormattable()
public prop(value: Date): string {
  return value.toString();
}
```

#### Defined in

wasm/lib/detailed/decorators/formatters.ts:42

___

### calculateExpiration

▸ **calculateExpiration**(`expirationTime?`): `void` \| `Date`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expirationTime?` | `string` \| `number` \| `Date` |

#### Returns

`void` \| `Date`

#### Defined in

wasm/lib/detailed/util/expiration_parser.ts:3

___

### createHiveChain

▸ **createHiveChain**(`options?`): `Promise`\<[`IHiveChainInterface`](#interfacesihivechaininterfacemd)\>

Creates a Wax Hive chain instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`\<[`IWaxOptionsChain`](#interfacesiwaxoptionschainmd)\> | wax options |

#### Returns

`Promise`\<[`IHiveChainInterface`](#interfacesihivechaininterfacemd)\>

Wax Hive chain API Instance

**`Throws`**

on any Wax API-related error

#### Defined in

wasm/lib/detailed/chain.ts:24

___

### createWaxFoundation

▸ **createWaxFoundation**(`options?`): `Promise`\<[`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)\>

Creates a Wax Hive base instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`\<[`IWaxOptions`](#interfacesiwaxoptionsmd)\> | wax options |

#### Returns

`Promise`\<[`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)\>

Wax Hive Base API Instance

**`Throws`**

on any Wax API-related error

#### Defined in

wasm/lib/detailed/base.ts:22


<a name="classesapiaccountmd"></a>

# Class: ApiAccount

## Constructors

### constructor

• **new ApiAccount**(): [`ApiAccount`](#classesapiaccountmd)

#### Returns

[`ApiAccount`](#classesapiaccountmd)

## Properties

### active

• **active**: [`ApiAuthority`](#classesapiauthoritymd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:70

___

### balance

• **balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:134

___

### can\_vote

• **can\_vote**: `boolean`

#### Defined in

wasm/lib/detailed/api/types/account.ts:122

___

### comment\_count

• **comment\_count**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:113

___

### created

• **created**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:98

___

### curation\_rewards

• **curation\_rewards**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:221

___

### delayed\_votes

• **delayed\_votes**: [`ApiDelayedVote`](#classesapidelayedvotemd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:258

___

### delegated\_vesting\_shares

• **delegated\_vesting\_shares**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:191

___

### downvote\_manabar

• **downvote\_manabar**: [`ApiManabar`](#classesapimanabarmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:130

___

### governance\_vote\_expiration\_ts

• **governance\_vote\_expiration\_ts**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:261

___

### hbd\_balance

• **hbd\_balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:142

___

### hbd\_last\_interest\_payment

• **hbd\_last\_interest\_payment**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:151

___

### hbd\_seconds

• **hbd\_seconds**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:145

___

### hbd\_seconds\_last\_update

• **hbd\_seconds\_last\_update**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:148

___

### id

• **id**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:59

___

### is\_smt

• **is\_smt**: `boolean`

#### Defined in

wasm/lib/detailed/api/types/account.ts:254

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:80

___

### last\_account\_recovery

• **last\_account\_recovery**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:107

___

### last\_account\_update

• **last\_account\_update**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:95

___

### last\_owner\_update

• **last\_owner\_update**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:92

___

### last\_post

• **last\_post**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:233

___

### last\_post\_edit

• **last\_post\_edit**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:239

___

### last\_root\_post

• **last\_root\_post**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:236

___

### last\_vote\_time

• **last\_vote\_time**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:242

___

### lifetime\_vote\_count

• **lifetime\_vote\_count**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:116

___

### memo\_key

• **memo\_key**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:77

___

### mined

• **mined**: `boolean`

#### Defined in

wasm/lib/detailed/api/types/account.ts:101

___

### name

• **name**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:62

___

### next\_vesting\_withdrawal

• **next\_vesting\_withdrawal**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:206

___

### open\_recurrent\_transfers

• **open\_recurrent\_transfers**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:251

___

### owner

• **owner**: [`ApiAuthority`](#classesapiauthoritymd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:66

___

### pending\_claimed\_accounts

• **pending\_claimed\_accounts**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:248

___

### pending\_transfers

• **pending\_transfers**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:218

___

### post\_bandwidth

• **post\_bandwidth**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:245

___

### post\_count

• **post\_count**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:119

___

### post\_voting\_power

• **post\_voting\_power**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:203

___

### posting

• **posting**: [`ApiAuthority`](#classesapiauthoritymd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:74

___

### posting\_json\_metadata

• **posting\_json\_metadata**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:83

___

### posting\_rewards

• **posting\_rewards**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:224

___

### previous\_owner\_update

• **previous\_owner\_update**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:89

___

### proxied\_vsf\_votes

• **proxied\_vsf\_votes**: (`string` \| `number`)[]

#### Defined in

wasm/lib/detailed/api/types/account.ts:227

___

### proxy

• **proxy**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:86

___

### received\_vesting\_shares

• **received\_vesting\_shares**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:195

___

### recovery\_account

• **recovery\_account**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:104

___

### reset\_account

• **reset\_account**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:110

___

### reward\_hbd\_balance

• **reward\_hbd\_balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:171

___

### reward\_hive\_balance

• **reward\_hive\_balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:175

___

### reward\_vesting\_balance

• **reward\_vesting\_balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:179

___

### reward\_vesting\_hive

• **reward\_vesting\_hive**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:183

___

### savings\_balance

• **savings\_balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:138

___

### savings\_hbd\_balance

• **savings\_hbd\_balance**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:155

___

### savings\_hbd\_last\_interest\_payment

• **savings\_hbd\_last\_interest\_payment**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:164

___

### savings\_hbd\_seconds

• **savings\_hbd\_seconds**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:158

___

### savings\_hbd\_seconds\_last\_update

• **savings\_hbd\_seconds\_last\_update**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:161

___

### savings\_withdraw\_requests

• **savings\_withdraw\_requests**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:167

___

### to\_withdraw

• **to\_withdraw**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:212

___

### vesting\_shares

• **vesting\_shares**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:187

___

### vesting\_withdraw\_rate

• **vesting\_withdraw\_rate**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:199

___

### voting\_manabar

• **voting\_manabar**: [`ApiManabar`](#classesapimanabarmd)

#### Defined in

wasm/lib/detailed/api/types/account.ts:126

___

### withdraw\_routes

• **withdraw\_routes**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:215

___

### withdrawn

• **withdrawn**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:209

___

### witnesses\_voted\_for

• **witnesses\_voted\_for**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:230


<a name="classesapiaccountauthmd"></a>

# Class: ApiAccountAuth

## Constructors

### constructor

• **new ApiAccountAuth**(): [`ApiAccountAuth`](#classesapiaccountauthmd)

#### Returns

[`ApiAccountAuth`](#classesapiaccountauthmd)

## Properties

### 0

• **0**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:11

___

### 1

• **1**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:14


<a name="classesapiauthoritymd"></a>

# Class: ApiAuthority

## Constructors

### constructor

• **new ApiAuthority**(): [`ApiAuthority`](#classesapiauthoritymd)

#### Returns

[`ApiAuthority`](#classesapiauthoritymd)

## Properties

### account\_auths

• **account\_auths**: [`ApiAccountAuth`](#classesapiaccountauthmd)[]

#### Defined in

wasm/lib/detailed/api/types/account.ts:41

___

### key\_auths

• **key\_auths**: [`ApiKeyAuth`](#classesapikeyauthmd)[]

#### Defined in

wasm/lib/detailed/api/types/account.ts:46

___

### weight\_threshold

• **weight\_threshold**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:36


<a name="classesapiblockmd"></a>

# Class: ApiBlock

## Hierarchy

- [`ApiBlockHeader`](#classesapiblockheadermd)

  ↳ **`ApiBlock`**

## Constructors

### constructor

• **new ApiBlock**(): [`ApiBlock`](#classesapiblockmd)

#### Returns

[`ApiBlock`](#classesapiblockmd)

#### Inherited from

[ApiBlockHeader](#classesapiblockheadermd).[constructor](#constructor)

## Properties

### block\_id

• **block\_id**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:33

___

### extensions

• **extensions**: `object`[] = `[]`

#### Inherited from

[ApiBlockHeader](#classesapiblockheadermd).[extensions](#extensions)

#### Defined in

wasm/lib/detailed/api/types/block.ts:21

___

### previous

• **previous**: `string`

#### Inherited from

[ApiBlockHeader](#classesapiblockheadermd).[previous](#previous)

#### Defined in

wasm/lib/detailed/api/types/block.ts:9

___

### signing\_key

• **signing\_key**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:36

___

### timestamp

• **timestamp**: `string`

#### Inherited from

[ApiBlockHeader](#classesapiblockheadermd).[timestamp](#timestamp)

#### Defined in

wasm/lib/detailed/api/types/block.ts:12

___

### transaction\_ids

• **transaction\_ids**: `string`[] = `[]`

#### Defined in

wasm/lib/detailed/api/types/block.ts:39

___

### transaction\_merkle\_root

• **transaction\_merkle\_root**: `string`

#### Inherited from

[ApiBlockHeader](#classesapiblockheadermd).[transaction_merkle_root](#transaction_merkle_root)

#### Defined in

wasm/lib/detailed/api/types/block.ts:18

___

### transactions

• **transactions**: [`ApiTransaction`](#classesapitransactionmd)[] = `[]`

#### Defined in

wasm/lib/detailed/api/types/block.ts:30

___

### witness

• **witness**: `string`

#### Inherited from

[ApiBlockHeader](#classesapiblockheadermd).[witness](#witness)

#### Defined in

wasm/lib/detailed/api/types/block.ts:15

___

### witness\_signature

• **witness\_signature**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:26


<a name="classesapiblockheadermd"></a>

# Class: ApiBlockHeader

## Hierarchy

- **`ApiBlockHeader`**

  ↳ [`ApiBlock`](#classesapiblockmd)

## Constructors

### constructor

• **new ApiBlockHeader**(): [`ApiBlockHeader`](#classesapiblockheadermd)

#### Returns

[`ApiBlockHeader`](#classesapiblockheadermd)

## Properties

### extensions

• **extensions**: `object`[] = `[]`

#### Defined in

wasm/lib/detailed/api/types/block.ts:21

___

### previous

• **previous**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:9

___

### timestamp

• **timestamp**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:12

___

### transaction\_merkle\_root

• **transaction\_merkle\_root**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:18

___

### witness

• **witness**: `string`

#### Defined in

wasm/lib/detailed/api/types/block.ts:15


<a name="classesapidelayedvotemd"></a>

# Class: ApiDelayedVote

## Constructors

### constructor

• **new ApiDelayedVote**(): [`ApiDelayedVote`](#classesapidelayedvotemd)

#### Returns

[`ApiDelayedVote`](#classesapidelayedvotemd)

## Properties

### time

• **time**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:28

___

### val

• **val**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:31


<a name="classesapikeyauthmd"></a>

# Class: ApiKeyAuth

## Constructors

### constructor

• **new ApiKeyAuth**(): [`ApiKeyAuth`](#classesapikeyauthmd)

#### Returns

[`ApiKeyAuth`](#classesapikeyauthmd)

## Properties

### 0

• **0**: `string`

#### Defined in

wasm/lib/detailed/api/types/account.ts:19

___

### 1

• **1**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:22


<a name="classesapimanabarmd"></a>

# Class: ApiManabar

## Constructors

### constructor

• **new ApiManabar**(): [`ApiManabar`](#classesapimanabarmd)

#### Returns

[`ApiManabar`](#classesapimanabarmd)

## Properties

### current\_mana

• **current\_mana**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:51

___

### last\_update\_time

• **last\_update\_time**: `number`

#### Defined in

wasm/lib/detailed/api/types/account.ts:54


<a name="classesapioperationmd"></a>

# Class: ApiOperation

## Constructors

### constructor

• **new ApiOperation**(): [`ApiOperation`](#classesapioperationmd)

#### Returns

[`ApiOperation`](#classesapioperationmd)

## Properties

### type

• **type**: `string`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:6

___

### value

• **value**: `object`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:9


<a name="classesapitransactionmd"></a>

# Class: ApiTransaction

## Constructors

### constructor

• **new ApiTransaction**(): [`ApiTransaction`](#classesapitransactionmd)

#### Returns

[`ApiTransaction`](#classesapitransactionmd)

## Properties

### expiration

• **expiration**: `string`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:24

___

### extensions

• **extensions**: `object`[] = `[]`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:31

___

### operations

• **operations**: [`ApiOperation`](#classesapioperationmd)[] = `[]`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:28

___

### ref\_block\_num

• **ref\_block\_num**: `number`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:16

___

### ref\_block\_prefix

• **ref\_block\_prefix**: `number`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:21

___

### signatures

• **signatures**: `string`[] = `[]`

#### Defined in

wasm/lib/detailed/api/types/transaction.ts:34


<a name="classesarticlebuildermd"></a>

# Class: ArticleBuilder

Same as the comment builder base, but requires user to set the category (parent permlink) on the comment

## Hierarchy

- `CommentBuilder`

  ↳ **`ArticleBuilder`**

## Constructors

### constructor

• **new ArticleBuilder**(`author`, `title`, `body`, `jsonMetadata?`, `permlink?`): [`ArticleBuilder`](#classesarticlebuildermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `author` | `string` |
| `title` | `string` |
| `body` | `string` |
| `jsonMetadata?` | `object` |
| `permlink?` | `string` |

#### Returns

[`ArticleBuilder`](#classesarticlebuildermd)

#### Overrides

CommentBuilder.constructor

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:322

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

CommentBuilder.api

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

CommentBuilder.builtOperations

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### comment

• `Protected` `Readonly` **comment**: [`comment`](#comment)

#### Inherited from

CommentBuilder.comment

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:15

___

### jsonMetadata

• `Protected` **jsonMetadata**: `Record`\<`string`, `any`\>

#### Inherited from

CommentBuilder.jsonMetadata

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:18

## Methods

### addBeneficiaries

▸ **addBeneficiaries**(`...accounts`): `CommentBuilder`

Adds beneficiary account(s) to the comment operation object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...accounts` | `beneficiary_route_type`[] | beneficiary accounts |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.addBeneficiaries

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:216

___

### addBeneficiary

▸ **addBeneficiary**(`account`, `weight`): `CommentBuilder`

Adds beneficiary account to the comment operation object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` | beneficiary account |
| `weight` | `number` | weight of the beneficiary account |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.addBeneficiary

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:189

___

### pushImages

▸ **pushImages**(`...images`): `CommentBuilder`

Pushes images to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...images` | `string`[] | image to be pushed to the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.pushImages

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:124

___

### pushLinks

▸ **pushLinks**(`...links`): `CommentBuilder`

Pushes links to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...links` | `string`[] | links to be pushed to the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.pushLinks

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:143

___

### pushMetadataProperty

▸ **pushMetadataProperty**(`keyOrObject`, `value?`): `CommentBuilder`

Assigns given object or sets given value on key in comment meta values

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keyOrObject` | `string` \| `object` | key to set the value on or the entire object of key-value pairs to assign to the json metadata object |
| `value?` | `any` | value to be set (optional when passing the entire object) |

#### Returns

`CommentBuilder`

itself

**`Throws`**

if key already exists on the jsonmetadata object

#### Inherited from

CommentBuilder.pushMetadataProperty

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:68

___

### pushTags

▸ **pushTags**(`...tags`): `CommentBuilder`

Pushes tags to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...tags` | `string`[] | tags to be pushed to the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.pushTags

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:92

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

CommentBuilder.requireApi

#### Defined in

wasm/lib/detailed/operation_builder.ts:49

___

### setAllowCurationRewards

▸ **setAllowCurationRewards**(`value`): `CommentBuilder`

Sets allow curation rewards

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | allow curation rewards value (defaults to `true`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.allow_curation_rewards](#allow_curation_rewards)

#### Inherited from

CommentBuilder.setAllowCurationRewards

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:263

___

### setAllowVotes

▸ **setAllowVotes**(`value`): `CommentBuilder`

Sets allow votes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | allow votes value (defaults to `true`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.allow_votes](#allow_votes)

#### Inherited from

CommentBuilder.setAllowVotes

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:279

___

### setAlternativeAuthor

▸ **setAlternativeAuthor**(`author`): `CommentBuilder`

Sets alternative author to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `author` | `string` | alternative author to be set on the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.setAlternativeAuthor

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:111

___

### setCategory

▸ **setCategory**(`category`): `CommentBuilder`

Sets category of the article

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `category` | `string` | category (parent permlink) and also the first tag |

#### Returns

`CommentBuilder`

ready to build transaction builder

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:333

___

### setDescription

▸ **setDescription**(`description`): `CommentBuilder`

Sets description on the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `description` | `string` | description to be set on the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.setDescription

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:162

___

### setFormat

▸ **setFormat**(`format`): `CommentBuilder`

Sets format on the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `format` | [`ECommentFormat`](#enumsecommentformatmd) | format to be set on the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.setFormat

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:175

___

### setMaxAcceptedPayout

▸ **setMaxAcceptedPayout**(`amount`): `CommentBuilder`

Sets maximum accepted payout on the comment

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | [`NaiAsset`](#classesnaiassetmd) | Maximum accepted payout (defaults to `1000000.000 HBD`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.max_accepted_payout](#max_accepted_payout)

#### Inherited from

CommentBuilder.setMaxAcceptedPayout

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:231

___

### setPercentHbd

▸ **setPercentHbd**(`value`): `CommentBuilder`

Sets percent hbd

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | percent hbd (defaults to `10000` - `HIVE_100_PERCENT`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.percent_hbd](#percent_hbd)

#### Inherited from

CommentBuilder.setPercentHbd

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:247


<a name="classesbroadcasttransactionrequestmd"></a>

# Class: BroadcastTransactionRequest

## Constructors

### constructor

• **new BroadcastTransactionRequest**(`trx?`): [`BroadcastTransactionRequest`](#classesbroadcasttransactionrequestmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `trx?` | [`ITransactionBuilder`](#interfacesitransactionbuildermd) |

#### Returns

[`BroadcastTransactionRequest`](#classesbroadcasttransactionrequestmd)

#### Defined in

wasm/lib/detailed/api/network_broadcast_api/broadcast_transaction.ts:10

## Properties

### max\_block\_age

• **max\_block\_age**: `number` = `-1`

#### Defined in

wasm/lib/detailed/api/network_broadcast_api/broadcast_transaction.ts:25

___

### trx

• **trx**: [`ApiTransaction`](#classesapitransactionmd)

#### Defined in

wasm/lib/detailed/api/network_broadcast_api/broadcast_transaction.ts:22


<a name="classesbroadcasttransactionresponsemd"></a>

# Class: BroadcastTransactionResponse

## Constructors

### constructor

• **new BroadcastTransactionResponse**(): [`BroadcastTransactionResponse`](#classesbroadcasttransactionresponsemd)

#### Returns

[`BroadcastTransactionResponse`](#classesbroadcasttransactionresponsemd)


<a name="classescommunityoperationmd"></a>

# Class: CommunityOperation

## Hierarchy

- [`HiveAppsOperation`](#classeshiveappsoperationmd)\<[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)\>

  ↳ **`CommunityOperation`**

## Constructors

### constructor

• **new CommunityOperation**(`accounts`, `community`, `data`): [`CommunityOperation`](#classescommunityoperationmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `accounts` | `string`[] |
| `community` | `string` |
| `data` | [`TCommunityRules`](#tcommunityrules) |

#### Returns

[`CommunityOperation`](#classescommunityoperationmd)

#### Overrides

[HiveAppsOperation](#classeshiveappsoperationmd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:25

## Properties

### accounts

• `Readonly` **accounts**: `string`[]

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:26

___

### community

• `Readonly` **community**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:27

___

### data

• `Readonly` **data**: [`TCommunityRules`](#tcommunityrules)

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:28

## Accessors

### builder

• `get` **builder**(): [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`CommunityOperationBuilder`](#classescommunityoperationbuildermd), `object`\>

Converts the current hive apps operation to the builder type ([HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd))

#### Returns

[`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`CommunityOperationBuilder`](#classescommunityoperationbuildermd), `object`\>

hive chain operation builder

#### Overrides

HiveAppsOperation.builder

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:33


<a name="classescommunityoperationbuildermd"></a>

# Class: CommunityOperationBuilder

## Hierarchy

- [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)\>

  ↳ **`CommunityOperationBuilder`**

## Constructors

### constructor

• **new CommunityOperationBuilder**(`hiveAppsOp?`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `hiveAppsOp?` | [`CommunityOperation`](#classescommunityoperationmd) |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

#### Overrides

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:116

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[api](#api)

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### body

• `Protected` **body**: `object`[] = `[]`

Object bodies to stringify in the final hive apps operation form - <i>Stage</i>

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[body](#body)

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:13

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[builtOperations](#builtoperations)

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### id

• `Protected` `Readonly` **id**: ``"community"``

Id of your custom hive apps operation

#### Overrides

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[id](#id)

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:114

## Methods

### authorize

▸ **authorize**(`requiredPostingAuths`, `requiredAuths?`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Authorizes the currently staged hive apps operation, commits it to the BuiltHiveAppsOperation instance and clears the stage

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `requiredPostingAuths` | `string` \| `string`[] | `undefined` | required posting authorities (can be an account name) |
| `requiredAuths` | `string`[] | `[]` | required authorities (defaults to the empty array) |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[authorize](#authorize)

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:30

___

### build

▸ **build**(): `IBuiltHiveAppsOperation`

Marks the current set of the hive apps operations as ready push

#### Returns

`IBuiltHiveAppsOperation`

instance of the hive apps operation class that you can pass to the [ITransactionBuilder.push](#push)

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[build](#build)

#### Defined in

wasm/lib/detailed/operation_builder.ts:70

___

### flagPost

▸ **flagPost**(`community`, `account`, `permlink`, `notes`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Flags post on given community

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `account` | `string` | author of the post to flag |
| `permlink` | `string` | post permlink to flag |
| `notes` | `string` | notes on the flag |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:145

___

### mutePost

▸ **mutePost**(`community`, `account`, `permlink`, `notes`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Mutes post on given community

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `account` | `string` | author of the post to mute |
| `permlink` | `string` | post permlink to mute |
| `notes` | `string` | notes on the mute |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:298

___

### pinPost

▸ **pinPost**(`community`, `account`, `permlink`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Pins given post on the community page

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `account` | `string` | author of the post to pin |
| `permlink` | `string` | post permlink to pin |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:226

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[requireApi](#requireapi)

#### Defined in

wasm/lib/detailed/operation_builder.ts:49

___

### setUserTitle

▸ **setUserTitle**(`community`, `account`, `title`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Sets title on the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `account` | `string` | account to change the title |
| `title` | `string` | new account title |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:168

___

### subscribe

▸ **subscribe**(`community`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Subscribes to given community

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:188

___

### unmutePost

▸ **unmutePost**(`community`, `account`, `permlink`, `notes`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Unmutes post on given community

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `account` | `string` | author of the post to unmute |
| `permlink` | `string` | post permlink to unmute |
| `notes` | `string` | notes on the unmute |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:322

___

### unpinPost

▸ **unpinPost**(`community`, `account`, `permlink`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Unpins given post from the community page

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `account` | `string` | author of the post to pin |
| `permlink` | `string` | post permlink to pin |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:248

___

### unsubscribe

▸ **unsubscribe**(`community`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Unsubscribes from given community

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:206

___

### updateProps

▸ **updateProps**(`community`, `props`): [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

Updates props for the given community

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `community` | `string` | target community |
| `props` | [`ICommunityProps`](#interfacesicommunitypropsmd) | community props |

#### Returns

[`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:269


<a name="classesfindaccountsrequestmd"></a>

# Class: FindAccountsRequest

## Constructors

### constructor

• **new FindAccountsRequest**(): [`FindAccountsRequest`](#classesfindaccountsrequestmd)

#### Returns

[`FindAccountsRequest`](#classesfindaccountsrequestmd)

## Properties

### accounts

• **accounts**: `string`[]

#### Defined in

wasm/lib/detailed/api/database_api/find_accounts.ts:8

___

### delayed\_votes\_active

• `Optional` **delayed\_votes\_active**: `boolean` = `true`

#### Defined in

wasm/lib/detailed/api/database_api/find_accounts.ts:12


<a name="classesfindaccountsresponsemd"></a>

# Class: FindAccountsResponse

## Constructors

### constructor

• **new FindAccountsResponse**(): [`FindAccountsResponse`](#classesfindaccountsresponsemd)

#### Returns

[`FindAccountsResponse`](#classesfindaccountsresponsemd)

## Properties

### accounts

• **accounts**: [`ApiAccount`](#classesapiaccountmd)[]

#### Defined in

wasm/lib/detailed/api/database_api/find_accounts.ts:18


<a name="classesfindrcaccountsrequestmd"></a>

# Class: FindRcAccountsRequest

## Constructors

### constructor

• **new FindRcAccountsRequest**(): [`FindRcAccountsRequest`](#classesfindrcaccountsrequestmd)

#### Returns

[`FindRcAccountsRequest`](#classesfindrcaccountsrequestmd)

## Properties

### accounts

• **accounts**: `string`[]

#### Defined in

wasm/lib/detailed/api/rc_api/find_rc_accounts.ts:9


<a name="classesfindrcaccountsresponsemd"></a>

# Class: FindRcAccountsResponse

## Constructors

### constructor

• **new FindRcAccountsResponse**(): [`FindRcAccountsResponse`](#classesfindrcaccountsresponsemd)

#### Returns

[`FindRcAccountsResponse`](#classesfindrcaccountsresponsemd)

## Properties

### rc\_accounts

• **rc\_accounts**: [`RcAccount`](#classesrcaccountmd)[]

#### Defined in

wasm/lib/detailed/api/rc_api/find_rc_accounts.ts:31


<a name="classesfollowoperationmd"></a>

# Class: FollowOperation

## Hierarchy

- [`HiveAppsOperation`](#classeshiveappsoperationmd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd)\>

  ↳ **`FollowOperation`**

## Constructors

### constructor

• **new FollowOperation**(`action`, `follower`, `following`): [`FollowOperation`](#classesfollowoperationmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`EFollowActions`](#enumsefollowactionsmd) |
| `follower` | `string` |
| `following` | `string`[] |

#### Returns

[`FollowOperation`](#classesfollowoperationmd)

#### Overrides

[HiveAppsOperation](#classeshiveappsoperationmd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:20

## Properties

### action

• `Readonly` **action**: [`EFollowActions`](#enumsefollowactionsmd)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:21

___

### follower

• `Readonly` **follower**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:22

___

### following

• `Readonly` **following**: `string`[]

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:23

## Accessors

### builder

• `get` **builder**(): [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd), `object`\>

Converts the current hive apps operation to the builder type ([HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd))

#### Returns

[`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd), `object`\>

hive chain operation builder

#### Overrides

HiveAppsOperation.builder

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:28


<a name="classesfollowoperationbuildermd"></a>

# Class: FollowOperationBuilder

## Hierarchy

- [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd)\>

  ↳ **`FollowOperationBuilder`**

## Constructors

### constructor

• **new FollowOperationBuilder**(`hiveAppsOp?`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `hiveAppsOp?` | [`ReblogOperation`](#classesreblogoperationmd) \| [`FollowOperation`](#classesfollowoperationmd) |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

#### Overrides

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:65

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[api](#api)

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### body

• `Protected` **body**: `object`[] = `[]`

Object bodies to stringify in the final hive apps operation form - <i>Stage</i>

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[body](#body)

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:13

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[builtOperations](#builtoperations)

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### id

• `Protected` `Readonly` **id**: ``"follow"``

Id of your custom hive apps operation

#### Overrides

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[id](#id)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:63

## Methods

### authorize

▸ **authorize**(`requiredPostingAuths`, `requiredAuths?`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Authorizes the currently staged hive apps operation, commits it to the BuiltHiveAppsOperation instance and clears the stage

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `requiredPostingAuths` | `string` \| `string`[] | `undefined` | required posting authorities (can be an account name) |
| `requiredAuths` | `string`[] | `[]` | required authorities (defaults to the empty array) |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[authorize](#authorize)

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:30

___

### blacklistBlog

▸ **blacklistBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to blacklist given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to be blacklisted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:193

___

### build

▸ **build**(): `IBuiltHiveAppsOperation`

Marks the current set of the hive apps operations as ready push

#### Returns

`IBuiltHiveAppsOperation`

instance of the hive apps operation class that you can pass to the [ITransactionBuilder.push](#push)

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[build](#build)

#### Defined in

wasm/lib/detailed/operation_builder.ts:70

___

### followBlacklistBlog

▸ **followBlacklistBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to follow blacklist of given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to follow blacklisted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:221

___

### followBlog

▸ **followBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to follow specified list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. Also it will be the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to be followed |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:123

___

### followBodyBuilder

▸ **followBodyBuilder**(`what`, `workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `what` | `string` |
| `workingAccount` | `string` |
| `blog` | `string` |
| `...otherBlogs` | `string`[] |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:95

___

### followMutedBlog

▸ **followMutedBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to follow muted of given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to follow muted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:277

___

### muteBlog

▸ **muteBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to mute given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to be muted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:151

___

### reblog

▸ **reblog**(`workingAccount`, `author`, `permlink`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to reblog specified post.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. Also it will be the account which reblogs given post (aka account) |
| `author` | `string` | account name of the author of the given post |
| `permlink` | `string` | permlink of the given post |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:346

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[requireApi](#requireapi)

#### Defined in

wasm/lib/detailed/operation_builder.ts:49

___

### resetAllBlog

▸ **resetAllBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to reset all lists of given blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to reset the lists |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:305

___

### resetBlacklistBlog

▸ **resetBlacklistBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to reset blacklist list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to reset the blacklist list |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:179

___

### resetBlogList

▸ **resetBlogList**(`action`, `workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to push operation to remove all matching entries between workingAccount (follower) and specified following blog accounts.
Scope of clear operation can be specfied by action parameter to point only blog, mute or both entries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | [`EFollowBlogAction`](#enumsefollowblogactionmd) | determines scope of entries removal |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/otherBlogs parameters (aka follower) |
| `blog` | `string` | the blog account to be muted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:319

___

### resetFollowBlacklistBlog

▸ **resetFollowBlacklistBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to reset follow blacklist list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to reset the follow blacklist list |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:207

___

### resetFollowMutedBlog

▸ **resetFollowMutedBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to reset follow blacklist list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to reset the follow blacklist list |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:263

___

### unblacklistBlog

▸ **unblacklistBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to unblacklist given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to be unblacklisted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:235

___

### unfollowBlacklistBlog

▸ **unfollowBlacklistBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to unfollow blacklist of given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to unfollow blacklisted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:249

___

### unfollowBlog

▸ **unfollowBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Unfollows / unmutes given blog

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. Also it will be the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to be unfollowed |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:137

___

### unfollowMutedBlog

▸ **unfollowMutedBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Allows to generate operation to unfollow muted of given list of blog accounts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to unfollow muted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:291

___

### unmuteBlog

▸ **unmuteBlog**(`workingAccount`, `blog`, `...otherBlogs`): [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

Unfollows / unmutes given blog

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower) |
| `blog` | `string` | the blog account to be unmuted |
| `...otherBlogs` | `string`[] | optional list of other blog accounts to be concatenated and build single list |

#### Returns

[`FollowOperationBuilder`](#classesfollowoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:165


<a name="classesgetblockheaderrequestmd"></a>

# Class: GetBlockHeaderRequest

## Constructors

### constructor

• **new GetBlockHeaderRequest**(): [`GetBlockHeaderRequest`](#classesgetblockheaderrequestmd)

#### Returns

[`GetBlockHeaderRequest`](#classesgetblockheaderrequestmd)

## Properties

### block\_num

• **block\_num**: `number`

#### Defined in

wasm/lib/detailed/api/block_api/get_block_header.ts:9


<a name="classesgetblockheaderresponsemd"></a>

# Class: GetBlockHeaderResponse

## Constructors

### constructor

• **new GetBlockHeaderResponse**(): [`GetBlockHeaderResponse`](#classesgetblockheaderresponsemd)

#### Returns

[`GetBlockHeaderResponse`](#classesgetblockheaderresponsemd)

## Properties

### header

• **header**: [`ApiBlockHeader`](#classesapiblockheadermd)

#### Defined in

wasm/lib/detailed/api/block_api/get_block_header.ts:15


<a name="classesgetblockrangerequestmd"></a>

# Class: GetBlockRangeRequest

## Constructors

### constructor

• **new GetBlockRangeRequest**(): [`GetBlockRangeRequest`](#classesgetblockrangerequestmd)

#### Returns

[`GetBlockRangeRequest`](#classesgetblockrangerequestmd)

## Properties

### count

• **count**: `number`

#### Defined in

wasm/lib/detailed/api/block_api/get_block_range.ts:14

___

### starting\_block\_num

• **starting\_block\_num**: `number`

#### Defined in

wasm/lib/detailed/api/block_api/get_block_range.ts:9


<a name="classesgetblockrangeresponsemd"></a>

# Class: GetBlockRangeResponse

## Constructors

### constructor

• **new GetBlockRangeResponse**(): [`GetBlockRangeResponse`](#classesgetblockrangeresponsemd)

#### Returns

[`GetBlockRangeResponse`](#classesgetblockrangeresponsemd)

## Properties

### blocks

• **blocks**: [`ApiBlock`](#classesapiblockmd)[]

#### Defined in

wasm/lib/detailed/api/block_api/get_block_range.ts:20


<a name="classesgetblockrequestmd"></a>

# Class: GetBlockRequest

## Constructors

### constructor

• **new GetBlockRequest**(): [`GetBlockRequest`](#classesgetblockrequestmd)

#### Returns

[`GetBlockRequest`](#classesgetblockrequestmd)

## Properties

### block\_num

• **block\_num**: `number`

#### Defined in

wasm/lib/detailed/api/block_api/get_block.ts:9


<a name="classesgetblockresponsemd"></a>

# Class: GetBlockResponse

## Constructors

### constructor

• **new GetBlockResponse**(): [`GetBlockResponse`](#classesgetblockresponsemd)

#### Returns

[`GetBlockResponse`](#classesgetblockresponsemd)

## Properties

### block

• `Optional` **block**: [`ApiBlock`](#classesapiblockmd)

#### Defined in

wasm/lib/detailed/api/block_api/get_block.ts:16


<a name="classesgetdynamicglobalpropertiesrequestmd"></a>

# Class: GetDynamicGlobalPropertiesRequest

## Constructors

### constructor

• **new GetDynamicGlobalPropertiesRequest**(): [`GetDynamicGlobalPropertiesRequest`](#classesgetdynamicglobalpropertiesrequestmd)

#### Returns

[`GetDynamicGlobalPropertiesRequest`](#classesgetdynamicglobalpropertiesrequestmd)


<a name="classesgetdynamicglobalpropertiesresponsemd"></a>

# Class: GetDynamicGlobalPropertiesResponse

## Constructors

### constructor

• **new GetDynamicGlobalPropertiesResponse**(): [`GetDynamicGlobalPropertiesResponse`](#classesgetdynamicglobalpropertiesresponsemd)

#### Returns

[`GetDynamicGlobalPropertiesResponse`](#classesgetdynamicglobalpropertiesresponsemd)

## Properties

### available\_account\_subsidies

• **available\_account\_subsidies**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:114

___

### confidential\_hbd\_supply

• **confidential\_hbd\_supply**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:53

___

### confidential\_supply

• **confidential\_supply**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:41

___

### content\_reward\_percent

• **content\_reward\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:129

___

### current\_aslot

• **current\_aslot**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:92

___

### current\_hbd\_supply

• **current\_hbd\_supply**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:49

___

### current\_supply

• **current\_supply**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:37

___

### current\_witness

• **current\_witness**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:23

___

### delegation\_return\_period

• **delegation\_return\_period**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:108

___

### downvote\_pool\_percent

• **downvote\_pool\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:143

___

### hbd\_interest\_rate

• **hbd\_interest\_rate**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:79

___

### hbd\_print\_rate

• **hbd\_print\_rate**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:82

___

### hbd\_start\_percent

• **hbd\_start\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:120

___

### hbd\_stop\_percent

• **hbd\_stop\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:117

___

### head\_block\_id

• **head\_block\_id**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:17

___

### head\_block\_number

• **head\_block\_number**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:14

___

### id

• **id**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:11

___

### init\_hbd\_supply

• **init\_hbd\_supply**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:45

___

### last\_budget\_time

• **last\_budget\_time**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:126

___

### last\_irreversible\_block\_num

• **last\_irreversible\_block\_num**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:101

___

### maximum\_block\_size

• **maximum\_block\_size**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:85

___

### next\_maintenance\_time

• **next\_maintenance\_time**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:123

___

### num\_pow\_witnesses

• **num\_pow\_witnesses**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:29

___

### participation\_count

• **participation\_count**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:98

___

### pending\_rewarded\_vesting\_hive

• **pending\_rewarded\_vesting\_hive**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:76

___

### pending\_rewarded\_vesting\_shares

• **pending\_rewarded\_vesting\_shares**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:72

___

### recent\_slots\_filled

• **recent\_slots\_filled**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:95

___

### required\_actions\_partition\_percent

• `Optional` **required\_actions\_partition\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:89

___

### reverse\_auction\_seconds

• **reverse\_auction\_seconds**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:111

___

### smt\_creation\_fee

• **smt\_creation\_fee**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:147

___

### sps\_fund\_percent

• `Optional` **sps\_fund\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:136

___

### sps\_interval\_ledger

• **sps\_interval\_ledger**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:140

___

### target\_votes\_per\_period

• `Optional` **target\_votes\_per\_period**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:105

___

### time

• **time**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:20

___

### total\_pow

• **total\_pow**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:26

___

### total\_reward\_fund\_hive

• **total\_reward\_fund\_hive**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:65

___

### total\_reward\_shares2

• **total\_reward\_shares2**: `string`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:68

___

### total\_vesting\_fund\_hive

• **total\_vesting\_fund\_hive**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:57

___

### total\_vesting\_shares

• **total\_vesting\_shares**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:61

___

### vesting\_reward\_percent

• **vesting\_reward\_percent**: `number`

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:132

___

### virtual\_supply

• **virtual\_supply**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/database_api/get_dynamic_global_properties.ts:33


<a name="classesgetkeyreferencesrequestmd"></a>

# Class: GetKeyReferencesRequest

## Constructors

### constructor

• **new GetKeyReferencesRequest**(): [`GetKeyReferencesRequest`](#classesgetkeyreferencesrequestmd)

#### Returns

[`GetKeyReferencesRequest`](#classesgetkeyreferencesrequestmd)

## Properties

### keys

• **keys**: `string`[]

#### Defined in

wasm/lib/detailed/api/account_by_key_api/get_key_references.ts:8


<a name="classesgetkeyreferencesresponsemd"></a>

# Class: GetKeyReferencesResponse

## Constructors

### constructor

• **new GetKeyReferencesResponse**(): [`GetKeyReferencesResponse`](#classesgetkeyreferencesresponsemd)

#### Returns

[`GetKeyReferencesResponse`](#classesgetkeyreferencesresponsemd)

## Properties

### accounts

• **accounts**: `string`[][]

#### Defined in

wasm/lib/detailed/api/account_by_key_api/get_key_references.ts:13


<a name="classeshiveappsoperationmd"></a>

# Class: HiveAppsOperation\<ChildT, BodyT\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ChildT` | extends [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`any`, `BodyT`\> |
| `BodyT` | extends `object` = `object` |

## Hierarchy

- **`HiveAppsOperation`**

  ↳ [`CommunityOperation`](#classescommunityoperationmd)

  ↳ [`ReblogOperation`](#classesreblogoperationmd)

  ↳ [`FollowOperation`](#classesfollowoperationmd)

  ↳ [`ResourceCreditsOperation`](#classesresourcecreditsoperationmd)

## Constructors

### constructor

• **new HiveAppsOperation**\<`ChildT`, `BodyT`\>(): [`HiveAppsOperation`](#classeshiveappsoperationmd)\<`ChildT`, `BodyT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ChildT` | extends [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`any`, `BodyT`\> |
| `BodyT` | extends `object` = `object` |

#### Returns

[`HiveAppsOperation`](#classeshiveappsoperationmd)\<`ChildT`, `BodyT`\>

## Accessors

### builder

• `get` **builder**(): [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`ChildT`, `BodyT`\>

Converts the current hive apps operation to the builder type ([HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd))

#### Returns

[`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`ChildT`, `BodyT`\>

hive chain operation builder

#### Defined in

wasm/lib/detailed/custom_jsons/apps_operation.ts:9


<a name="classeshiveappsoperationsbuildermd"></a>

# Class: HiveAppsOperationsBuilder\<ChildT, BodyT\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ChildT` | extends [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`any`, `BodyT`\> |
| `BodyT` | extends `object` = `object` |

## Hierarchy

- `OperationBuilder`

  ↳ **`HiveAppsOperationsBuilder`**

  ↳↳ [`CommunityOperationBuilder`](#classescommunityoperationbuildermd)

  ↳↳ [`FollowOperationBuilder`](#classesfollowoperationbuildermd)

  ↳↳ [`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

## Constructors

### constructor

• **new HiveAppsOperationsBuilder**\<`ChildT`, `BodyT`\>(): [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`ChildT`, `BodyT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ChildT` | extends [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`any`, `BodyT`\> |
| `BodyT` | extends `object` = `object` |

#### Returns

[`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<`ChildT`, `BodyT`\>

#### Inherited from

OperationBuilder.constructor

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

OperationBuilder.api

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### body

• `Protected` **body**: `BodyT`[] = `[]`

Object bodies to stringify in the final hive apps operation form - <i>Stage</i>

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:13

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

OperationBuilder.builtOperations

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### id

• `Protected` `Readonly` `Abstract` **id**: `string`

Id of your custom hive apps operation

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:20

## Methods

### authorize

▸ **authorize**(`requiredPostingAuths`, `requiredAuths?`): `ChildT`

Authorizes the currently staged hive apps operation, commits it to the BuiltHiveAppsOperation instance and clears the stage

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `requiredPostingAuths` | `string` \| `string`[] | `undefined` | required posting authorities (can be an account name) |
| `requiredAuths` | `string`[] | `[]` | required authorities (defaults to the empty array) |

#### Returns

`ChildT`

itself

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:30

___

### build

▸ **build**(): `IBuiltHiveAppsOperation`

Marks the current set of the hive apps operations as ready push

#### Returns

`IBuiltHiveAppsOperation`

instance of the hive apps operation class that you can pass to the [ITransactionBuilder.push](#push)

#### Inherited from

OperationBuilder.build

#### Defined in

wasm/lib/detailed/operation_builder.ts:70

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

OperationBuilder.requireApi

#### Defined in

wasm/lib/detailed/operation_builder.ts:49


<a name="classesnaiassetmd"></a>

# Class: NaiAsset

## Constructors

### constructor

• **new NaiAsset**(): [`NaiAsset`](#classesnaiassetmd)

#### Returns

[`NaiAsset`](#classesnaiassetmd)

## Properties

### amount

• **amount**: `string`

#### Defined in

wasm/lib/detailed/api/types/asset.ts:7

___

### nai

• **nai**: `string`

#### Defined in

wasm/lib/detailed/api/types/asset.ts:13

___

### precision

• **precision**: `number`

#### Defined in

wasm/lib/detailed/api/types/asset.ts:10


<a name="classesoperationvisitormd"></a>

# Class: OperationVisitor\<R\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `void` |

## Implements

- [`TOperationVisitor`](#toperationvisitor)\<`R`\>

## Constructors

### constructor

• **new OperationVisitor**\<`R`\>(): [`OperationVisitor`](#classesoperationvisitormd)\<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `void` |

#### Returns

[`OperationVisitor`](#classesoperationvisitormd)\<`R`\>

## Methods

### accept

▸ **accept**(`op`): `Object`

You should not override this method

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`operation`](#operation) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `[_]` | typeof `_` |

#### Defined in

wasm/lib/visitor.ts:26

___

### account\_create

▸ **account_create**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`account_create`](#account_create) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.account\_create

#### Defined in

wasm/lib/visitor.ts:42

___

### account\_create\_with\_delegation

▸ **account_create_with_delegation**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`account_create_with_delegation`](#account_create_with_delegation) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.account\_create\_with\_delegation

#### Defined in

wasm/lib/visitor.ts:71

___

### account\_update

▸ **account_update**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`account_update`](#account_update) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.account\_update

#### Defined in

wasm/lib/visitor.ts:43

___

### account\_update2

▸ **account_update2**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`account_update2`](#account_update2) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.account\_update2

#### Defined in

wasm/lib/visitor.ts:73

___

### account\_witness\_proxy

▸ **account_witness_proxy**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`account_witness_proxy`](#account_witness_proxy) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.account\_witness\_proxy

#### Defined in

wasm/lib/visitor.ts:46

___

### account\_witness\_vote

▸ **account_witness_vote**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`account_witness_vote`](#account_witness_vote) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.account\_witness\_vote

#### Defined in

wasm/lib/visitor.ts:45

___

### cancel\_transfer\_from\_savings

▸ **cancel_transfer_from_savings**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`cancel_transfer_from_savings`](#cancel_transfer_from_savings) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.cancel\_transfer\_from\_savings

#### Defined in

wasm/lib/visitor.ts:67

___

### change\_recovery\_account

▸ **change_recovery_account**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`change_recovery_account`](#change_recovery_account) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.change\_recovery\_account

#### Defined in

wasm/lib/visitor.ts:59

___

### claim\_account

▸ **claim_account**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`claim_account`](#claim_account) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.claim\_account

#### Defined in

wasm/lib/visitor.ts:55

___

### claim\_reward\_balance

▸ **claim_reward_balance**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`claim_reward_balance`](#claim_reward_balance) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.claim\_reward\_balance

#### Defined in

wasm/lib/visitor.ts:69

___

### collateralized\_convert

▸ **collateralized_convert**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`collateralized_convert`](#collateralized_convert) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.collateralized\_convert

#### Defined in

wasm/lib/visitor.ts:78

___

### comment

▸ **comment**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`comment`](#comment) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.comment

#### Defined in

wasm/lib/visitor.ts:34

___

### comment\_options

▸ **comment_options**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`comment_options`](#comment_options) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.comment\_options

#### Defined in

wasm/lib/visitor.ts:52

___

### convert

▸ **convert**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`convert`](#convert) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.convert

#### Defined in

wasm/lib/visitor.ts:41

___

### create\_claimed\_account

▸ **create_claimed_account**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`create_claimed_account`](#create_claimed_account) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.create\_claimed\_account

#### Defined in

wasm/lib/visitor.ts:56

___

### create\_proposal

▸ **create_proposal**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`create_proposal`](#create_proposal) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.create\_proposal

#### Defined in

wasm/lib/visitor.ts:74

___

### custom

▸ **custom**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`custom`](#custom) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.custom

#### Defined in

wasm/lib/visitor.ts:48

___

### custom\_json

▸ **custom_json**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`custom_json`](#custom_json) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.custom\_json

#### Defined in

wasm/lib/visitor.ts:51

___

### decline\_voting\_rights

▸ **decline_voting_rights**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`decline_voting_rights`](#decline_voting_rights) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.decline\_voting\_rights

#### Defined in

wasm/lib/visitor.ts:68

___

### delegate\_vesting\_shares

▸ **delegate_vesting_shares**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`delegate_vesting_shares`](#delegate_vesting_shares) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.delegate\_vesting\_shares

#### Defined in

wasm/lib/visitor.ts:70

___

### delete\_comment

▸ **delete_comment**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`delete_comment`](#delete_comment) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.delete\_comment

#### Defined in

wasm/lib/visitor.ts:50

___

### escrow\_approve

▸ **escrow_approve**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`escrow_approve`](#escrow_approve) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.escrow\_approve

#### Defined in

wasm/lib/visitor.ts:64

___

### escrow\_dispute

▸ **escrow_dispute**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`escrow_dispute`](#escrow_dispute) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.escrow\_dispute

#### Defined in

wasm/lib/visitor.ts:61

___

### escrow\_release

▸ **escrow_release**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`escrow_release`](#escrow_release) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.escrow\_release

#### Defined in

wasm/lib/visitor.ts:62

___

### escrow\_transfer

▸ **escrow_transfer**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`escrow_transfer`](#escrow_transfer) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.escrow\_transfer

#### Defined in

wasm/lib/visitor.ts:60

___

### feed\_publish

▸ **feed_publish**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`feed_publish`](#feed_publish) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.feed\_publish

#### Defined in

wasm/lib/visitor.ts:40

___

### limit\_order\_cancel

▸ **limit_order_cancel**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`limit_order_cancel`](#limit_order_cancel) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.limit\_order\_cancel

#### Defined in

wasm/lib/visitor.ts:39

___

### limit\_order\_create

▸ **limit_order_create**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`limit_order_create`](#limit_order_create) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.limit\_order\_create

#### Defined in

wasm/lib/visitor.ts:38

___

### limit\_order\_create2

▸ **limit_order_create2**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`limit_order_create2`](#limit_order_create2) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.limit\_order\_create2

#### Defined in

wasm/lib/visitor.ts:54

___

### pow

▸ **pow**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`pow`](#pow) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.pow

#### Defined in

wasm/lib/visitor.ts:47

___

### pow2

▸ **pow2**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`pow2`](#pow2) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.pow2

#### Defined in

wasm/lib/visitor.ts:63

___

### recover\_account

▸ **recover_account**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`recover_account`](#recover_account) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.recover\_account

#### Defined in

wasm/lib/visitor.ts:58

___

### recurrent\_transfer

▸ **recurrent_transfer**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`recurrent_transfer`](#recurrent_transfer) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.recurrent\_transfer

#### Defined in

wasm/lib/visitor.ts:79

___

### remove\_proposal

▸ **remove_proposal**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`remove_proposal`](#remove_proposal) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.remove\_proposal

#### Defined in

wasm/lib/visitor.ts:76

___

### request\_account\_recovery

▸ **request_account_recovery**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`request_account_recovery`](#request_account_recovery) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.request\_account\_recovery

#### Defined in

wasm/lib/visitor.ts:57

___

### set\_withdraw\_vesting\_route

▸ **set_withdraw_vesting_route**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`set_withdraw_vesting_route`](#set_withdraw_vesting_route) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.set\_withdraw\_vesting\_route

#### Defined in

wasm/lib/visitor.ts:53

___

### transfer

▸ **transfer**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`transfer`](#transfer) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.transfer

#### Defined in

wasm/lib/visitor.ts:35

___

### transfer\_from\_savings

▸ **transfer_from_savings**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`transfer_from_savings`](#transfer_from_savings) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.transfer\_from\_savings

#### Defined in

wasm/lib/visitor.ts:66

___

### transfer\_to\_savings

▸ **transfer_to_savings**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`transfer_to_savings`](#transfer_to_savings) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.transfer\_to\_savings

#### Defined in

wasm/lib/visitor.ts:65

___

### transfer\_to\_vesting

▸ **transfer_to_vesting**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`transfer_to_vesting`](#transfer_to_vesting) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.transfer\_to\_vesting

#### Defined in

wasm/lib/visitor.ts:36

___

### update\_proposal

▸ **update_proposal**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`update_proposal`](#update_proposal) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.update\_proposal

#### Defined in

wasm/lib/visitor.ts:77

___

### update\_proposal\_votes

▸ **update_proposal_votes**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`update_proposal_votes`](#update_proposal_votes) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.update\_proposal\_votes

#### Defined in

wasm/lib/visitor.ts:75

___

### vote

▸ **vote**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`vote`](#vote) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.vote

#### Defined in

wasm/lib/visitor.ts:33

___

### withdraw\_vesting

▸ **withdraw_vesting**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`withdraw_vesting`](#withdraw_vesting) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.withdraw\_vesting

#### Defined in

wasm/lib/visitor.ts:37

___

### witness\_block\_approve

▸ **witness_block_approve**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`witness_block_approve`](#witness_block_approve) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.witness\_block\_approve

#### Defined in

wasm/lib/visitor.ts:49

___

### witness\_set\_properties

▸ **witness_set_properties**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`witness_set_properties`](#witness_set_properties) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.witness\_set\_properties

#### Defined in

wasm/lib/visitor.ts:72

___

### witness\_update

▸ **witness_update**(`op`): `R`

#### Parameters

| Name | Type |
| :------ | :------ |
| `op` | [`witness_update`](#witness_update) |

#### Returns

`R`

#### Implementation of

TOperationVisitor.witness\_update

#### Defined in

wasm/lib/visitor.ts:44


<a name="classesrcaccountmd"></a>

# Class: RcAccount

## Constructors

### constructor

• **new RcAccount**(): [`RcAccount`](#classesrcaccountmd)

#### Returns

[`RcAccount`](#classesrcaccountmd)

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/detailed/api/rc_api/find_rc_accounts.ts:14

___

### max\_rc

• **max\_rc**: `string` \| `number`

#### Defined in

wasm/lib/detailed/api/rc_api/find_rc_accounts.ts:25

___

### max\_rc\_creation\_adjustment

• **max\_rc\_creation\_adjustment**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/api/rc_api/find_rc_accounts.ts:22

___

### rc\_manabar

• **rc\_manabar**: [`ApiManabar`](#classesapimanabarmd)

#### Defined in

wasm/lib/detailed/api/rc_api/find_rc_accounts.ts:18


<a name="classesreblogoperationmd"></a>

# Class: ReblogOperation

## Hierarchy

- [`HiveAppsOperation`](#classeshiveappsoperationmd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd)\>

  ↳ **`ReblogOperation`**

## Constructors

### constructor

• **new ReblogOperation**(`account`, `author`, `permlink`): [`ReblogOperation`](#classesreblogoperationmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` |
| `author` | `string` |
| `permlink` | `string` |

#### Returns

[`ReblogOperation`](#classesreblogoperationmd)

#### Overrides

[HiveAppsOperation](#classeshiveappsoperationmd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:6

## Properties

### account

• `Readonly` **account**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:7

___

### author

• `Readonly` **author**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:8

___

### permlink

• `Readonly` **permlink**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:9

## Accessors

### builder

• `get` **builder**(): [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd), `object`\>

Converts the current hive apps operation to the builder type ([HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd))

#### Returns

[`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`FollowOperationBuilder`](#classesfollowoperationbuildermd), `object`\>

hive chain operation builder

#### Overrides

HiveAppsOperation.builder

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:14


<a name="classesrecurrenttransferbuildermd"></a>

# Class: RecurrentTransferBuilder

## Hierarchy

- `OperationBuilder`

  ↳ **`RecurrentTransferBuilder`**

  ↳↳ [`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

## Constructors

### constructor

• **new RecurrentTransferBuilder**(`from`, `to`, `amount`, `memo?`, `recurrence?`, `executions?`): [`RecurrentTransferBuilder`](#classesrecurrenttransferbuildermd)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `from` | `string` | `undefined` |
| `to` | `string` | `undefined` |
| `amount` | [`asset`](#asset) | `undefined` |
| `memo` | `string` | `""` |
| `recurrence` | `number` | `24` |
| `executions` | `number` | `2` |

#### Returns

[`RecurrentTransferBuilder`](#classesrecurrenttransferbuildermd)

#### Overrides

OperationBuilder.constructor

#### Defined in

wasm/lib/detailed/operation_factories/recurrent_transfer.ts:9

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

OperationBuilder.api

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

OperationBuilder.builtOperations

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### recurrentTransfer

• `Protected` `Readonly` **recurrentTransfer**: [`recurrent_transfer`](#recurrent_transfer)

#### Defined in

wasm/lib/detailed/operation_factories/recurrent_transfer.ts:7

## Methods

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

OperationBuilder.requireApi

#### Defined in

wasm/lib/detailed/operation_builder.ts:49


<a name="classesrecurrenttransferpairidbuildermd"></a>

# Class: RecurrentTransferPairIdBuilder

## Hierarchy

- [`RecurrentTransferBuilder`](#classesrecurrenttransferbuildermd)

  ↳ **`RecurrentTransferPairIdBuilder`**

## Constructors

### constructor

• **new RecurrentTransferPairIdBuilder**(`from`, `to`, `pairId`, `memo?`, `recurrence?`, `executions?`): [`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `from` | `string` | `undefined` |
| `to` | `string` | `undefined` |
| `pairId` | `number` | `undefined` |
| `memo` | `string` | `""` |
| `recurrence` | `number` | `24` |
| `executions` | `number` | `2` |

#### Returns

[`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

#### Overrides

[RecurrentTransferBuilder](#classesrecurrenttransferbuildermd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/operation_factories/recurrent_transfer.ts:33

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

[RecurrentTransferBuilder](#classesrecurrenttransferbuildermd).[api](#api)

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

[RecurrentTransferBuilder](#classesrecurrenttransferbuildermd).[builtOperations](#builtoperations)

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### recurrentTransfer

• `Protected` `Readonly` **recurrentTransfer**: [`recurrent_transfer`](#recurrent_transfer)

#### Inherited from

[RecurrentTransferBuilder](#classesrecurrenttransferbuildermd).[recurrentTransfer](#recurrenttransfer)

#### Defined in

wasm/lib/detailed/operation_factories/recurrent_transfer.ts:7

## Methods

### addPairId

▸ **addPairId**(`pairId`): [`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

Adds pair id to the recurrent transfer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pairId` | `number` | Pair id to add to the recurrent transfer |

#### Returns

[`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

itself

#### Defined in

wasm/lib/detailed/operation_factories/recurrent_transfer.ts:47

___

### generateRemoval

▸ **generateRemoval**(): [`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

Removes recurrent transfer with the previously set pair id

#### Returns

[`RecurrentTransferPairIdBuilder`](#classesrecurrenttransferpairidbuildermd)

itself

#### Defined in

wasm/lib/detailed/operation_factories/recurrent_transfer.ts:62

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

[RecurrentTransferBuilder](#classesrecurrenttransferbuildermd).[requireApi](#requireapi)

#### Defined in

wasm/lib/detailed/operation_builder.ts:49


<a name="classesreplybuildermd"></a>

# Class: ReplyBuilder

Same as the comment builder base, but requires parentAuthor and parentPermlink to be set

## Hierarchy

- `CommentBuilder`

  ↳ **`ReplyBuilder`**

## Constructors

### constructor

• **new ReplyBuilder**(`parentAuthor`, `parentPermlink`, `author`, `body`, `jsonMetadata?`, `permlink?`, `title?`): [`ReplyBuilder`](#classesreplybuildermd)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `parentAuthor` | `string` | `undefined` |
| `parentPermlink` | `string` | `undefined` |
| `author` | `string` | `undefined` |
| `body` | `string` | `undefined` |
| `jsonMetadata?` | `object` | `undefined` |
| `permlink?` | `string` | `undefined` |
| `title` | `string` | `""` |

#### Returns

[`ReplyBuilder`](#classesreplybuildermd)

#### Overrides

CommentBuilder.constructor

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:307

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

CommentBuilder.api

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

CommentBuilder.builtOperations

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### comment

• `Protected` `Readonly` **comment**: [`comment`](#comment)

#### Inherited from

CommentBuilder.comment

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:15

___

### jsonMetadata

• `Protected` **jsonMetadata**: `Record`\<`string`, `any`\>

#### Inherited from

CommentBuilder.jsonMetadata

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:18

## Methods

### addBeneficiaries

▸ **addBeneficiaries**(`...accounts`): `CommentBuilder`

Adds beneficiary account(s) to the comment operation object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...accounts` | `beneficiary_route_type`[] | beneficiary accounts |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.addBeneficiaries

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:216

___

### addBeneficiary

▸ **addBeneficiary**(`account`, `weight`): `CommentBuilder`

Adds beneficiary account to the comment operation object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` | beneficiary account |
| `weight` | `number` | weight of the beneficiary account |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.addBeneficiary

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:189

___

### pushImages

▸ **pushImages**(`...images`): `CommentBuilder`

Pushes images to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...images` | `string`[] | image to be pushed to the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.pushImages

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:124

___

### pushLinks

▸ **pushLinks**(`...links`): `CommentBuilder`

Pushes links to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...links` | `string`[] | links to be pushed to the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.pushLinks

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:143

___

### pushMetadataProperty

▸ **pushMetadataProperty**(`keyOrObject`, `value?`): `CommentBuilder`

Assigns given object or sets given value on key in comment meta values

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keyOrObject` | `string` \| `object` | key to set the value on or the entire object of key-value pairs to assign to the json metadata object |
| `value?` | `any` | value to be set (optional when passing the entire object) |

#### Returns

`CommentBuilder`

itself

**`Throws`**

if key already exists on the jsonmetadata object

#### Inherited from

CommentBuilder.pushMetadataProperty

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:68

___

### pushTags

▸ **pushTags**(`...tags`): `CommentBuilder`

Pushes tags to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...tags` | `string`[] | tags to be pushed to the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.pushTags

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:92

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

CommentBuilder.requireApi

#### Defined in

wasm/lib/detailed/operation_builder.ts:49

___

### setAllowCurationRewards

▸ **setAllowCurationRewards**(`value`): `CommentBuilder`

Sets allow curation rewards

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | allow curation rewards value (defaults to `true`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.allow_curation_rewards](#allow_curation_rewards)

#### Inherited from

CommentBuilder.setAllowCurationRewards

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:263

___

### setAllowVotes

▸ **setAllowVotes**(`value`): `CommentBuilder`

Sets allow votes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | allow votes value (defaults to `true`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.allow_votes](#allow_votes)

#### Inherited from

CommentBuilder.setAllowVotes

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:279

___

### setAlternativeAuthor

▸ **setAlternativeAuthor**(`author`): `CommentBuilder`

Sets alternative author to the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `author` | `string` | alternative author to be set on the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.setAlternativeAuthor

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:111

___

### setDescription

▸ **setDescription**(`description`): `CommentBuilder`

Sets description on the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `description` | `string` | description to be set on the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.setDescription

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:162

___

### setFormat

▸ **setFormat**(`format`): `CommentBuilder`

Sets format on the json metadata object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `format` | [`ECommentFormat`](#enumsecommentformatmd) | format to be set on the json metadata object |

#### Returns

`CommentBuilder`

itself

#### Inherited from

CommentBuilder.setFormat

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:175

___

### setMaxAcceptedPayout

▸ **setMaxAcceptedPayout**(`amount`): `CommentBuilder`

Sets maximum accepted payout on the comment

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | [`NaiAsset`](#classesnaiassetmd) | Maximum accepted payout (defaults to `1000000.000 HBD`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.max_accepted_payout](#max_accepted_payout)

#### Inherited from

CommentBuilder.setMaxAcceptedPayout

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:231

___

### setPercentHbd

▸ **setPercentHbd**(`value`): `CommentBuilder`

Sets percent hbd

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | percent hbd (defaults to `10000` - `HIVE_100_PERCENT`) |

#### Returns

`CommentBuilder`

itself

**`See`**

[comment_options.percent_hbd](#percent_hbd)

#### Inherited from

CommentBuilder.setPercentHbd

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:247


<a name="classesresourcecreditsoperationmd"></a>

# Class: ResourceCreditsOperation

## Hierarchy

- [`HiveAppsOperation`](#classeshiveappsoperationmd)\<[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)\>

  ↳ **`ResourceCreditsOperation`**

## Constructors

### constructor

• **new ResourceCreditsOperation**(`from`, `rc`, `delegatees`): [`ResourceCreditsOperation`](#classesresourcecreditsoperationmd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `rc` | [`NaiAsset`](#classesnaiassetmd) |
| `delegatees` | `string`[] |

#### Returns

[`ResourceCreditsOperation`](#classesresourcecreditsoperationmd)

#### Overrides

[HiveAppsOperation](#classeshiveappsoperationmd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:7

## Properties

### delegatees

• `Readonly` **delegatees**: `string`[]

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:10

___

### from

• `Readonly` **from**: `string`

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:8

___

### rc

• `Readonly` **rc**: [`NaiAsset`](#classesnaiassetmd)

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:9

## Accessors

### builder

• `get` **builder**(): [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd), `object`\>

Converts the current hive apps operation to the builder type ([HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd))

#### Returns

[`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd), `object`\>

hive chain operation builder

#### Overrides

HiveAppsOperation.builder

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:15


<a name="classesresourcecreditsoperationbuildermd"></a>

# Class: ResourceCreditsOperationBuilder

## Hierarchy

- [`HiveAppsOperationsBuilder`](#classeshiveappsoperationsbuildermd)\<[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)\>

  ↳ **`ResourceCreditsOperationBuilder`**

## Constructors

### constructor

• **new ResourceCreditsOperationBuilder**(`hiveAppsOp?`): [`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `hiveAppsOp?` | [`ResourceCreditsOperation`](#classesresourcecreditsoperationmd) |

#### Returns

[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

#### Overrides

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:23

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[api](#api)

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### body

• `Protected` **body**: `object`[] = `[]`

Object bodies to stringify in the final hive apps operation form - <i>Stage</i>

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[body](#body)

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:13

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[builtOperations](#builtoperations)

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### id

• `Protected` `Readonly` **id**: ``"rc"``

Id of your custom hive apps operation

#### Overrides

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[id](#id)

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:21

## Methods

### authorize

▸ **authorize**(`requiredPostingAuths`, `requiredAuths?`): [`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

Authorizes the currently staged hive apps operation, commits it to the BuiltHiveAppsOperation instance and clears the stage

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `requiredPostingAuths` | `string` \| `string`[] | `undefined` | required posting authorities (can be an account name) |
| `requiredAuths` | `string`[] | `[]` | required authorities (defaults to the empty array) |

#### Returns

[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

itself

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[authorize](#authorize)

#### Defined in

wasm/lib/detailed/custom_jsons/builder.ts:30

___

### build

▸ **build**(): `IBuiltHiveAppsOperation`

Marks the current set of the hive apps operations as ready push

#### Returns

`IBuiltHiveAppsOperation`

instance of the hive apps operation class that you can pass to the [ITransactionBuilder.push](#push)

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[build](#build)

#### Defined in

wasm/lib/detailed/operation_builder.ts:70

___

### delegate

▸ **delegate**(`workingAccount`, `maxRc`, `delegatee`, `...otherDelegatees`): [`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

Delegates resource credits to given account(s)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. Also it will be the account which delegates resource credits (aka from) |
| `maxRc` | `string` \| `number` \| `Long` | maximum resource credits delegated (must pe non-negative value) |
| `delegatee` | `string` | target account to delegate. Remember you cannot delegate to yourself! |
| `...otherDelegatees` | `string`[] | optional list of other target accounts to delegate. In the standard node configuration there may be 100 delegatees at most. |

#### Returns

[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:48

___

### removeDelegation

▸ **removeDelegation**(`workingAccount`, `delegatee`, `...otherDelegatees`): [`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

Removes resource credits delegation from given account(s)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workingAccount` | `string` | The account which has to authorize transaction. Also it will be the account which delegated resource credits in the past (aka from) |
| `delegatee` | `string` | target account to remove the delegation from. |
| `...otherDelegatees` | `string`[] | optional list of other target accounts to remove the delegation from. |

#### Returns

[`ResourceCreditsOperationBuilder`](#classesresourcecreditsoperationbuildermd)

itself

#### Defined in

wasm/lib/detailed/custom_jsons/rc.ts:74

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

[HiveAppsOperationsBuilder](#classeshiveappsoperationsbuildermd).[requireApi](#requireapi)

#### Defined in

wasm/lib/detailed/operation_builder.ts:49


<a name="classesupdateproposalbuildermd"></a>

# Class: UpdateProposalBuilder

## Hierarchy

- `OperationBuilder`

  ↳ **`UpdateProposalBuilder`**

## Constructors

### constructor

• **new UpdateProposalBuilder**(`proposalId`, `creator`, `dailyPay`, `subject`, `permlink`, `endDate?`): [`UpdateProposalBuilder`](#classesupdateproposalbuildermd)

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `string` \| `number` |
| `creator` | `string` |
| `dailyPay` | [`asset`](#asset) |
| `subject` | `string` |
| `permlink` | `string` |
| `endDate?` | `string` \| `number` \| `Date` |

#### Returns

[`UpdateProposalBuilder`](#classesupdateproposalbuildermd)

#### Overrides

OperationBuilder.constructor

#### Defined in

wasm/lib/detailed/operation_factories/update_proposal.ts:9

## Properties

### api

• `Optional` **api**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Inherited from

OperationBuilder.api

#### Defined in

wasm/lib/detailed/operation_builder.ts:54

___

### builtOperations

• `Protected` `Readonly` **builtOperations**: `BuiltHiveAppsOperation`

#### Inherited from

OperationBuilder.builtOperations

#### Defined in

wasm/lib/detailed/operation_builder.ts:47

___

### updateProposal

• `Private` `Readonly` **updateProposal**: [`update_proposal`](#update_proposal)

#### Defined in

wasm/lib/detailed/operation_factories/update_proposal.ts:7

## Methods

### addEndDate

▸ **addEndDate**(`endDate`): [`UpdateProposalBuilder`](#classesupdateproposalbuildermd)

Adds end date to the update proposal

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `endDate` | `string` \| `number` \| `Date` | end date |

#### Returns

[`UpdateProposalBuilder`](#classesupdateproposalbuildermd)

itself

#### Defined in

wasm/lib/detailed/operation_factories/update_proposal.ts:30

___

### requireApi

▸ **requireApi**(): `void`

#### Returns

`void`

#### Inherited from

OperationBuilder.requireApi

#### Defined in

wasm/lib/detailed/operation_builder.ts:49


<a name="classesverifyauthorityrequestmd"></a>

# Class: VerifyAuthorityRequest

## Constructors

### constructor

• **new VerifyAuthorityRequest**(): [`VerifyAuthorityRequest`](#classesverifyauthorityrequestmd)

#### Returns

[`VerifyAuthorityRequest`](#classesverifyauthorityrequestmd)

## Properties

### pack

• **pack**: [`TTransactionPackType`](#enumsttransactionpacktypemd) = `TTransactionPackType.HF_26`

#### Defined in

wasm/lib/detailed/api/database_api/verify_authority.ts:11

___

### trx

• **trx**: [`ApiTransaction`](#classesapitransactionmd)

#### Defined in

wasm/lib/detailed/api/database_api/verify_authority.ts:8


<a name="classesverifyauthorityresponsemd"></a>

# Class: VerifyAuthorityResponse

## Constructors

### constructor

• **new VerifyAuthorityResponse**(): [`VerifyAuthorityResponse`](#classesverifyauthorityresponsemd)

#### Returns

[`VerifyAuthorityResponse`](#classesverifyauthorityresponsemd)

## Properties

### valid

• **valid**: `boolean` = `false`

#### Defined in

wasm/lib/detailed/api/database_api/verify_authority.ts:16


<a name="classeswaxformattermd"></a>

# Class: WaxFormatter

Classes implementing this interface denote that they are ready to handle tagged templates

## Hierarchy

- [`WaxFormatterBase`](#classeswaxformatterbasemd)

  ↳ **`WaxFormatter`**

## Implements

- [`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

## Constructors

### constructor

• **new WaxFormatter**(`wax`, `options?`): [`WaxFormatter`](#classeswaxformattermd)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wax` | [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd) | - |
| `options?` | `Object` | - |
| `options.asset?` | \{ displayAsNai?: boolean \| undefined; appendTokenName?: boolean \| undefined; formatAmount?: boolean \| undefined; locales?: string \| (string \| undefined)[] \| undefined; } | - |
| `options.createDefaultFormatters?` | `boolean` | Initializes formatter class with default wax formatters **`Default`** ```ts true ``` |
| `options.transaction?` | \{ displayAsId?: boolean \| undefined; } | - |

#### Returns

[`WaxFormatter`](#classeswaxformattermd)

#### Overrides

[WaxFormatterBase](#classeswaxformatterbasemd).[constructor](#constructor)

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:23

## Properties

### instances

• `Private` **instances**: `IInstancesData`[]

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:21

___

### matchers

• `Private` **matchers**: `Map`\<`string`, `IMatchersData`\>

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:20

___

### options

• `Readonly` **options**: [`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)

Options for the formatter

#### Implementation of

[IWaxExtendableFormatter](#interfacesiwaxextendableformattermd).[options](#options)

#### Inherited from

[WaxFormatterBase](#classeswaxformatterbasemd).[options](#options)

#### Defined in

wasm/lib/detailed/formatters/base.ts:16

___

### wax

• `Protected` `Readonly` **wax**: [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:24

## Methods

### cloneMatchersTo

▸ **cloneMatchersTo**(`instance`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | [`WaxFormatter`](#classeswaxformattermd) |

#### Returns

`void`

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:42

___

### extend

▸ **extend**(`formatterConstructor`, `options?`): [`WaxFormatter`](#classeswaxformattermd)

Allows users to extend the default wax formatter using custom user-defined formatters with [WaxFormattable](#waxformattable)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `formatterConstructor` | [`TWaxCustomFormatterConstructor`](#twaxcustomformatterconstructor) \| \{ `asset?`: \{ displayAsNai?: boolean \| undefined; appendTokenName?: boolean \| undefined; formatAmount?: boolean \| undefined; locales?: string \| (string \| undefined)[] \| undefined; } ; `createDefaultFormatters?`: `boolean` ; `transaction?`: \{ displayAsId?: boolean \| undefined; }  } | constructable formatter object |
| `options?` | `Object` | formatter options |
| `options.asset?` | \{ displayAsNai?: boolean \| undefined; appendTokenName?: boolean \| undefined; formatAmount?: boolean \| undefined; locales?: string \| (string \| undefined)[] \| undefined; } | - |
| `options.createDefaultFormatters?` | `boolean` | Initializes formatter class with default wax formatters **`Default`** ```ts true ``` |
| `options.transaction?` | \{ displayAsId?: boolean \| undefined; } | - |

#### Returns

[`WaxFormatter`](#classeswaxformattermd)

extended formatter class

#### Implementation of

[IWaxExtendableFormatter](#interfacesiwaxextendableformattermd).[extend](#extend)

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:87

___

### format

▸ **format**\<`I`, `R`\>(`data`): `R`

Formats given data based on formatter options

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `I` | raw data |

#### Returns

`R`

formatted data

**`Example`**

Formatting data
```typescript
formatter.format(naiObject);
```

#### Implementation of

[IWaxExtendableFormatter](#interfacesiwaxextendableformattermd).[format](#format)

#### Inherited from

[WaxFormatterBase](#classeswaxformatterbasemd).[format](#format)

#### Defined in

wasm/lib/detailed/formatters/base.ts:71

___

### formatNumber

▸ **formatNumber**(`amount`, `precision?`, `locales?`): `string`

Formats numbers in given format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | number to be formatted |
| `precision?` | `number` | the exact precision of the given number (defaults to undefined - dynamic precision) |
| `locales?` | `string` \| `string`[] | A string with a BCP 47 language, or an array of such locale identifiers (defaults to undefined - current locale) |

#### Returns

`string`

formatted number

#### Implementation of

[IWaxExtendableFormatter](#interfacesiwaxextendableformattermd).[formatNumber](#formatnumber)

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:60

___

### waxify

▸ **waxify**(`strings`, `...args`): `string`

Formats given text based on arguments structure

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strings` | `TemplateStringsArray` | raw strings |
| `...args` | `unknown`[] | arguments to be parsed using custom wax formatters |

#### Returns

`string`

formatted data

**`Example`**

Formatting data
```typescript
formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
```

#### Implementation of

[IWaxExtendableFormatter](#interfacesiwaxextendableformattermd).[waxify](#waxify)

#### Inherited from

[WaxFormatterBase](#classeswaxformatterbasemd).[waxify](#waxify)

#### Defined in

wasm/lib/detailed/formatters/base.ts:75

___

### create

▸ **create**(`wax`, `options?`): [`WaxFormatter`](#classeswaxformattermd)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wax` | [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd) | - |
| `options?` | `Object` | - |
| `options.asset?` | \{ displayAsNai?: boolean \| undefined; appendTokenName?: boolean \| undefined; formatAmount?: boolean \| undefined; locales?: string \| (string \| undefined)[] \| undefined; } | - |
| `options.createDefaultFormatters?` | `boolean` | Initializes formatter class with default wax formatters **`Default`** ```ts true ``` |
| `options.transaction?` | \{ displayAsId?: boolean \| undefined; } | - |

#### Returns

[`WaxFormatter`](#classeswaxformattermd)

#### Defined in

wasm/lib/detailed/formatters/waxify.ts:30


<a name="classeswaxformatterbasemd"></a>

# Class: WaxFormatterBase

Classes implementing this interface denote that they are ready to handle tagged templates

## Hierarchy

- **`WaxFormatterBase`**

  ↳ [`WaxFormatter`](#classeswaxformattermd)

## Implements

- [`IWaxFormatter`](#interfacesiwaxformattermd)

## Constructors

### constructor

• **new WaxFormatterBase**(`options?`): [`WaxFormatterBase`](#classeswaxformatterbasemd)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | - |
| `options.asset?` | \{ displayAsNai?: boolean \| undefined; appendTokenName?: boolean \| undefined; formatAmount?: boolean \| undefined; locales?: string \| (string \| undefined)[] \| undefined; } | - |
| `options.createDefaultFormatters?` | `boolean` | Initializes formatter class with default wax formatters **`Default`** ```ts true ``` |
| `options.transaction?` | \{ displayAsId?: boolean \| undefined; } | - |

#### Returns

[`WaxFormatterBase`](#classeswaxformatterbasemd)

#### Defined in

wasm/lib/detailed/formatters/base.ts:18

## Properties

### options

• `Readonly` **options**: [`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)

Options for the formatter

#### Implementation of

[IWaxFormatter](#interfacesiwaxformattermd).[options](#options)

#### Defined in

wasm/lib/detailed/formatters/base.ts:16

## Methods

### format

▸ **format**\<`I`, `R`\>(`data`): `R`

Formats given data based on formatter options

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `I` | raw data |

#### Returns

`R`

formatted data

**`Example`**

Formatting data
```typescript
formatter.format(naiObject);
```

#### Implementation of

[IWaxFormatter](#interfacesiwaxformattermd).[format](#format)

#### Defined in

wasm/lib/detailed/formatters/base.ts:71

___

### formatParser

▸ **formatParser**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`string`

#### Defined in

wasm/lib/detailed/formatters/base.ts:62

___

### handleProperty

▸ **handleProperty**(`source`, `target`, `property`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `object` |
| `target` | `any` |
| `property` | `string` |

#### Returns

`any`

#### Defined in

wasm/lib/detailed/formatters/base.ts:26

___

### rawDataParser

▸ **rawDataParser**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`any`

#### Defined in

wasm/lib/detailed/formatters/base.ts:44

___

### traverseTemplateValue

▸ **traverseTemplateValue**(`source`, `target`, `key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `object` |
| `target` | `object` |
| `key` | `string` \| `number` |

#### Returns

`void`

#### Defined in

wasm/lib/detailed/formatters/base.ts:28

___

### waxify

▸ **waxify**(`strings`, `...args`): `string`

Formats given text based on arguments structure

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strings` | `TemplateStringsArray` | raw strings |
| `...args` | `unknown`[] | arguments to be parsed using custom wax formatters |

#### Returns

`string`

formatted data

**`Example`**

Formatting data
```typescript
formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
```

#### Implementation of

[IWaxFormatter](#interfacesiwaxformattermd).[waxify](#waxify)

#### Defined in

wasm/lib/detailed/formatters/base.ts:75


<a name="enumsecommentformatmd"></a>

# Enumeration: ECommentFormat

## Enumeration Members

### HTML

• **HTML** = ``"html"``

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:9

___

### MARKDOWN

• **MARKDOWN** = ``"markdown"``

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:10

___

### MIXED

• **MIXED** = ``"markdown+html"``

#### Defined in

wasm/lib/detailed/operation_factories/comment.ts:11


<a name="enumsecommunityoperationactionsmd"></a>

# Enumeration: ECommunityOperationActions

## Enumeration Members

### FLAG\_POST

• **FLAG\_POST** = ``"flagPost"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:102

___

### MUTE\_POST

• **MUTE\_POST** = ``"mutePost"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:109

___

### PIN\_POST

• **PIN\_POST** = ``"pinPost"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:106

___

### SET\_USER\_TITLE

• **SET\_USER\_TITLE** = ``"setUserTitle"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:103

___

### SUBSCRIBE

• **SUBSCRIBE** = ``"subscribe"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:104

___

### UNMUTE\_POST

• **UNMUTE\_POST** = ``"unmutePost"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:110

___

### UNPIN\_POST

• **UNPIN\_POST** = ``"unpinPost"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:107

___

### UNSUBSCRIBE

• **UNSUBSCRIBE** = ``"unsubscribe"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:105

___

### UPDATE\_PROPS

• **UPDATE\_PROPS** = ``"updateProps"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:108


<a name="enumsefollowactionsmd"></a>

# Enumeration: EFollowActions

## Enumeration Members

### BLACKLIST

• **BLACKLIST** = ``"blacklist"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:49

___

### FOLLOW

• **FOLLOW** = ``"blog"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:45

___

### FOLLOW\_BLACKLIST

• **FOLLOW\_BLACKLIST** = ``"follow_blacklist"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:51

___

### FOLLOW\_MUTED

• **FOLLOW\_MUTED** = ``"follow_muted"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:55

___

### MUTE

• **MUTE** = ``"ignore"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:47

___

### RESET\_ALL\_LISTS

• **RESET\_ALL\_LISTS** = ``"reset_all_lists"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:57

___

### RESET\_BLACKLIST

• **RESET\_BLACKLIST** = ``"reset_blacklist"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:48

___

### RESET\_FOLLOWING\_LIST

• **RESET\_FOLLOWING\_LIST** = ``"reset_following_list"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:58

___

### RESET\_FOLLOW\_BLACKLIST

• **RESET\_FOLLOW\_BLACKLIST** = ``"reset_follow_blacklist"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:50

___

### RESET\_FOLLOW\_MUTED\_LIST

• **RESET\_FOLLOW\_MUTED\_LIST** = ``"reset_follow_muted_list"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:54

___

### RESET\_MUTED\_LIST

• **RESET\_MUTED\_LIST** = ``"reset_muted_list"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:59

___

### UNBLACKLIST

• **UNBLACKLIST** = ``"unblacklist"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:52

___

### UNFOLLOW

• **UNFOLLOW** = ``""``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:46

___

### UNFOLLOW\_BLACKLIST

• **UNFOLLOW\_BLACKLIST** = ``"unfollow_blacklist"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:53

___

### UNFOLLOW\_MUTED

• **UNFOLLOW\_MUTED** = ``"unfollow_muted"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:56


<a name="enumsefollowblogactionmd"></a>

# Enumeration: EFollowBlogAction

## Enumeration Members

### BOTH

• **BOTH** = ``2``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:36

___

### FOLLOW\_BLOG

• **FOLLOW\_BLOG** = ``0``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:34

___

### MUTE\_BLOG

• **MUTE\_BLOG** = ``1``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:35


<a name="enumsefollowoperationactionsmd"></a>

# Enumeration: EFollowOperationActions

## Enumeration Members

### FOLLOW

• **FOLLOW** = ``"follow"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:40

___

### REBLOG

• **REBLOG** = ``"reblog"``

#### Defined in

wasm/lib/detailed/custom_jsons/follow.ts:41


<a name="enumsemanabartypemd"></a>

# Enumeration: EManabarType

## Enumeration Members

### DOWNVOTE

• **DOWNVOTE** = ``1``

#### Defined in

wasm/lib/detailed/chain_api.ts:17

___

### RC

• **RC** = ``2``

#### Defined in

wasm/lib/detailed/chain_api.ts:18

___

### UPVOTE

• **UPVOTE** = ``0``

#### Defined in

wasm/lib/detailed/chain_api.ts:16


<a name="enumsesupportedlanguagesmd"></a>

# Enumeration: ESupportedLanguages

## Enumeration Members

### CHINESE

• **CHINESE** = ``"zh"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:41

___

### ENGLISH

• **ENGLISH** = ``"en"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:39

___

### GERMAN

• **GERMAN** = ``"de"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:47

___

### ITALIAN

• **ITALIAN** = ``"it"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:46

___

### KOREAN

• **KOREAN** = ``"kr"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:40

___

### MALAY

• **MALAY** = ``"ms"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:42

___

### POLISH

• **POLISH** = ``"pl"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:43

___

### PORTUGUESE

• **PORTUGUESE** = ``"pt"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:44

___

### RUSSIAN

• **RUSSIAN** = ``"ru"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:45

___

### SPANISH

• **SPANISH** = ``"es"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:48

___

### SWEDISH

• **SWEDISH** = ``"sv"``

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:49


<a name="enumsttransactionpacktypemd"></a>

# Enumeration: TTransactionPackType

## Enumeration Members

### HF\_26

• **HF\_26** = ``"hf26"``

#### Defined in

wasm/lib/detailed/api/types/index.ts:6

___

### LEGACY

• **LEGACY** = ``"legacy"``

#### Defined in

wasm/lib/detailed/api/types/index.ts:6


<a name="interfacesicommunitypropsmd"></a>

# Interface: ICommunityProps

## Properties

### about

• `Optional` **about**: `string`

Community about

**`Default`**

```ts
""
```

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:66

___

### description

• `Optional` **description**: `string`

Community description

**`Default`**

```ts
""
```

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:90

___

### flag\_text

• `Optional` **flag\_text**: `string`

Community rules

**`Default`**

```ts
""
```

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:98

___

### is\_nsfw

• `Optional` **is\_nsfw**: `boolean`

Is Not Safe For Work

**`Default`**

```ts
false
```

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:74

___

### lang

• `Optional` **lang**: `string`

Community language

**`Default`**

```ts
ESupportedLanguages.ENGLISH
```

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:82

___

### title

• **title**: `string`

Community title

#### Defined in

wasm/lib/detailed/custom_jsons/community.ts:58


<a name="interfacesiencryptingtransactionbuildermd"></a>

# Interface: IEncryptingTransactionBuilder

Same as [ITransactionBuilder](#interfacesitransactionbuildermd), but marks operations as encrypted using given keys, which will be encrypted upon
[ITransactionBuilderBase.sign](#sign) or [ITransactionBuilderBase.build](#build).

Note: We are not able to encrypt all operations.
We are currently supporting:
- Encryption of `body` in comment operation
- Encryption of `json` in custom_json operation
- Encryption of `memo` in transfer operation
- Encryption of `memo` in transfer_to_savings operation
- Encryption of `memo` in transfer_from_savings operation
- Encryption of `memo` in recurrent_transfer operation

**`Example`**

Base encrypting transaction builder usage
```typescript
const tx = new waxFoundation.TransactionBuilder();

tx.startEncrypt(myPublicKey).push({
   transfer: {
     amount: chain.hive(100),
     from_account: "gtg",
     to_account: "initminer",
     memo: "This should be encrypted"
   }
}).stopEncrypt();
```

## Hierarchy

- `ITransactionBuilderBase`

  ↳ **`IEncryptingTransactionBuilder`**

## Accessors

### id

• `get` **id**(): `string`

Generates id of the transaction (HF26 serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.id

#### Defined in

wasm/lib/interfaces.ts:105

___

### legacy\_id

• `get` **legacy_id**(): `string`

Generates id of the transaction (legacy serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.legacy\_id

#### Defined in

wasm/lib/interfaces.ts:116

___

### legacy\_sigDigest

• `get` **legacy_sigDigest**(): `string`

Generates digest of the transaction for signing (legacy serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.legacy\_sigDigest

#### Defined in

wasm/lib/interfaces.ts:96

___

### legacy\_signatureKeys

• `get` **legacy_signatureKeys**(): `string`[]

Returns signature keys from the transaction signatures (legacy serialization form is used).

#### Returns

`string`[]

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.legacy\_signatureKeys

#### Defined in

wasm/lib/interfaces.ts:136

___

### sigDigest

• `get` **sigDigest**(): `string`

Generates digest of the transaction for signing (HF26 serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.sigDigest

#### Defined in

wasm/lib/interfaces.ts:85

___

### signatureKeys

• `get` **signatureKeys**(): `string`[]

Returns signature keys from the transaction signatures

#### Returns

`string`[]

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.signatureKeys

#### Defined in

wasm/lib/interfaces.ts:125

## Methods

### build

▸ **build**(`wallet`, `publicKey`): [`transaction`](#transaction)

Signs the transaction using given public key and returns the proto transaction. Applies the transaction expiration time

Encrypts operations if any were created using [IEncryptingTransactionBuilder](#interfacesiencryptingtransactionbuildermd) interface

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | unlocked wallet to be used for signing |
| `publicKey` | `string` | publicKey for signing (should be available in the wallet) |

#### Returns

[`transaction`](#transaction)

signed protobuf transaction object

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.build

#### Defined in

wasm/lib/interfaces.ts:198

▸ **build**(`signature`): [`transaction`](#transaction)

Adds your signature to the internal signatures array and returns the proto transaction. Applies the transaction expiration time

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signature` | `string` | signature to add |

#### Returns

[`transaction`](#transaction)

protobuf transaction object

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.build

#### Defined in

wasm/lib/interfaces.ts:209

▸ **build**(): [`transaction`](#transaction)

Returns the proto transaction. Applies the transaction expiration time.

#### Returns

[`transaction`](#transaction)

transaction

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.build

#### Defined in

wasm/lib/interfaces.ts:218

___

### decrypt

▸ **decrypt**(`wallet`): [`transaction`](#transaction)

Decrypts all underlying encrypted operations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | unlocked wallet to be used for decryption |

#### Returns

[`transaction`](#transaction)

protobuf transaction object

**`Throws`**

on any Wax API-related error including validation error

#### Inherited from

ITransactionBuilderBase.decrypt

#### Defined in

wasm/lib/interfaces.ts:147

___

### isSigned

▸ **isSigned**(): `boolean`

Checks if underlying transaction has been already signed at least one time (after [sign](#sign) or [build](#build))

#### Returns

`boolean`

either true or false based on the signatures amount

#### Inherited from

ITransactionBuilderBase.isSigned

#### Defined in

wasm/lib/interfaces.ts:184

___

### push

▸ **push**(`op`): [`IEncryptingTransactionBuilder`](#interfacesiencryptingtransactionbuildermd)

Pushes given operation to the operations array in the transaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `op` | [`operation`](#operation) \| [`HiveAppsOperation`](#classeshiveappsoperationmd)\<`any`, `object`\> \| `IBuiltHiveAppsOperation` | operation to append to the transaction (can be hive apps operation) |

#### Returns

[`IEncryptingTransactionBuilder`](#interfacesiencryptingtransactionbuildermd)

current transaction builder instance

**`Throws`**

on any Wax API-related error

#### Defined in

wasm/lib/interfaces.ts:360

___

### sign

▸ **sign**(`wallet`, `publicKey`): `string`

Signs the transaction using given public key. Applies the transaction expiration time

Encrypts operations if any were created using [IEncryptingTransactionBuilder](#interfacesiencryptingtransactionbuildermd) interface

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | unlocked wallet to be used for signing |
| `publicKey` | `string` | publicKey for signing (should be available in the wallet) |

#### Returns

`string`

transaction signature signed using given key

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.sign

#### Defined in

wasm/lib/interfaces.ts:177

___

### stopEncrypt

▸ **stopEncrypt**(): [`ITransactionBuilder`](#interfacesitransactionbuildermd)

Stops encryption chain

Note: This call is optional if you are not going to push any other decrypted operations

#### Returns

[`ITransactionBuilder`](#interfacesitransactionbuildermd)

current transaction builder instance

#### Defined in

wasm/lib/interfaces.ts:369

___

### toApi

▸ **toApi**(): `string`

Converts the created transaction into the Hive API-form string

#### Returns

`string`

transaction in Hive API-form

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.toApi

#### Defined in

wasm/lib/interfaces.ts:227

___

### toLegacyApi

▸ **toLegacyApi**(): `string`

Converts the created transaction into the Hive API-legacy form JSON string.

Legacy form differs in few aspects to regular (HF26) one:
- for operations type/value dictionary object is replaced by array tuple, where first item points operation type and second operation body
- asset values are encoded in their legacy form having specified token names after amount values, i.e. 1.000 HIVE

Transaction legacy form (even it has shorter JSON code for the first look) is much more error prone, like also
produces **larger binary serialization output**, what is directly stored in blocks. Binary form is the input for signature generation too.
In general, preferred way of generating transactions is HF-26 form (default in this library).

This method is added only for convenience and better cooperation to other transaction processing tools accepting only this form.

#### Returns

`string`

transaction in Legacy Hive API-form

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.toLegacyApi

#### Defined in

wasm/lib/interfaces.ts:248

___

### toString

▸ **toString**(): `string`

Converts transaction object into the protobuf JSON string

#### Returns

`string`

protobuf JSON string

**`Throws`**

on any Wax API-related error including validation error

#### Inherited from

ITransactionBuilderBase.toString

#### Defined in

wasm/lib/interfaces.ts:163

___

### useBuilder

▸ **useBuilder**\<`TBuilder`\>(`builderConstructor`, `builderFn`, `...constructorArgs`): [`IEncryptingTransactionBuilder`](#interfacesiencryptingtransactionbuildermd)

Uses given builder to construct operations and push them to the current instance of the transaction builder

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TBuilder` | extends (...`args`: `any`[]) => `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `builderConstructor` | `TBuilder` | Builder constructor (class) |
| `builderFn` | (`builder`: [`TInterfaceOperationBuilder`](#tinterfaceoperationbuilder)\<`InstanceType`\<`TBuilder`\>\>) => `void` | Lambda function for your builder configuration |
| `...constructorArgs` | `ConstructorParameters`\<`TBuilder`\> | Optional arguments to pass to the builder constructor |

#### Returns

[`IEncryptingTransactionBuilder`](#interfacesiencryptingtransactionbuildermd)

current transaction builder instance

**`Throws`**

on any Wax API-related error

**`See`**

 - Operation factories: [ArticleBuilder](#classesarticlebuildermd), [ReplyBuilder](#classesreplybuildermd), [RecurrentTransferPairIdBuilder](#classesrecurrenttransferpairidbuildermd), [RecurrentTransferBuilder](#classesrecurrenttransferbuildermd), [UpdateProposalBuilder](#classesupdateproposalbuildermd)
 - Hive Apps operation builders: [CommunityOperationBuilder](#classescommunityoperationbuildermd), [FollowOperationBuilder](#classesfollowoperationbuildermd), [ResourceCreditsOperationBuilder](#classesresourcecreditsoperationbuildermd)

**`Example`**

Building article
```typescript
 tx.useBuilder(ArticleBuilder, builder => {
     builder.setCategory('blog');
 }, 'gtg', 'My first post', '# Hello world!');
```

#### Defined in

wasm/lib/interfaces.ts:392

___

### validate

▸ **validate**(): `void`

Validates current transaction. Throws on error

#### Returns

`void`

**`Throws`**

on any Wax API-related error including validation error

#### Inherited from

ITransactionBuilderBase.validate

#### Defined in

wasm/lib/interfaces.ts:154


<a name="interfacesiformatfunctionargumentsmd"></a>

# Interface: IFormatFunctionArguments\<TSource, TTarget\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSource` | `object` |
| `TTarget` | `any` |

## Properties

### options

• `Readonly` **options**: `DeepReadonlyObject`\<[`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)\>

Formatter options

#### Defined in

wasm/lib/detailed/formatters/types.ts:72

___

### source

• `Readonly` **source**: [`DeepReadonly`](#deepreadonly)\<`TSource`\>

Source readonly unchanged input value for parsing raw data

#### Defined in

wasm/lib/detailed/formatters/types.ts:80

___

### target

• **target**: `TTarget`

Target formatter data that might have been previously changed by other formatters

#### Defined in

wasm/lib/detailed/formatters/types.ts:87


<a name="interfacesihiveassetdatamd"></a>

# Interface: IHiveAssetData

## Properties

### amount

• **amount**: `string`

Asset amount

**`Example`**

```ts
"1.100"
```

#### Defined in

wasm/lib/interfaces.ts:438

___

### symbol

• **symbol**: `string`

Asset symbol

**`Example`**

```ts
"HIVE"
```

#### Defined in

wasm/lib/interfaces.ts:445


<a name="interfacesihivechaininterfacemd"></a>

# Interface: IHiveChainInterface

## Hierarchy

- [`IWaxBaseInterface`](#interfacesiwaxbaseinterfacemd)

  ↳ **`IHiveChainInterface`**

## Properties

### ASSETS

• `Readonly` **ASSETS**: `Readonly`\<`Record`\<`EAssetName`, [`NaiAsset`](#classesnaiassetmd)\>\>

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[ASSETS](#assets)

#### Defined in

wasm/lib/interfaces.ts:451

___

### api

• `Readonly` **api**: `Readonly`\<`IHiveApi`\>

#### Defined in

wasm/lib/interfaces.ts:669

___

### formatter

• `Readonly` **formatter**: [`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[formatter](#formatter)

#### Defined in

wasm/lib/interfaces.ts:453

___

### waxify

• `Readonly` **waxify**: (`strings`: `TemplateStringsArray`, ...`args`: `unknown`[]) => `string`

#### Type declaration

▸ (`strings`, `...args`): `string`

Formats given text based on arguments structure

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strings` | `TemplateStringsArray` | raw strings |
| `...args` | `unknown`[] | arguments to be parsed using custom wax formatters |

##### Returns

`string`

formatted data

**`Example`**

Formatting data
```typescript
formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
```

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[waxify](#waxify)

#### Defined in

wasm/lib/interfaces.ts:454

## Accessors

### TransactionBuilder

• `get` **TransactionBuilder**(): [`ITransactionBuilderConstructor`](#interfacesitransactionbuilderconstructormd)

#### Returns

[`ITransactionBuilderConstructor`](#interfacesitransactionbuilderconstructormd)

#### Inherited from

IWaxBaseInterface.TransactionBuilder

#### Defined in

wasm/lib/interfaces.ts:449

___

### endpointUrl

• `get` **endpointUrl**(): `string`

Allows to query for endpoint url used to perform API calls.

#### Returns

`string`

#### Defined in

wasm/lib/interfaces.ts:631

• `set` **endpointUrl**(`endpoint`): `void`

Allows to override default endpoint URL used to call RPC APIs initially configured by [IWaxOptionsChain](#interfacesiwaxoptionschainmd) passed to [createHiveChain](#createhivechain) builder function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | `string` |

#### Returns

`void`

#### Defined in

wasm/lib/interfaces.ts:626

## Methods

### calculateCurrentManabarValue

▸ **calculateCurrentManabarValue**(`now`, `maxManaLH`, `currentManaLH`, `lastUpdateTime`): [`IManabarData`](#interfacesimanabardatamd)

Calculates current manabar value for Hive account based on given arguments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `now` | `number` | head block time. Can be obtained using time property from dynamic global properties |
| `maxManaLH` | `string` \| `number` \| `Long` | maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes. For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call. For rc manabar calculations use max_rc value from the rc_accounts API call. |
| `currentManaLH` | `string` \| `number` \| `Long` | current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |
| `lastUpdateTime` | `number` | last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |

#### Returns

[`IManabarData`](#interfacesimanabardatamd)

Manabar data

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[calculateCurrentManabarValue](#calculatecurrentmanabarvalue)

#### Defined in

wasm/lib/interfaces.ts:541

___

### calculateCurrentManabarValueForAccount

▸ **calculateCurrentManabarValueForAccount**(`account`, `manabarType?`): `Promise`\<[`IManabarData`](#interfacesimanabardatamd)\>

Calculates current manabar value for Hive account based on given arguments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` | account for which we want to calculate current manabar value |
| `manabarType?` | [`EManabarType`](#enumsemanabartypemd) | manabar type to calculate (can be upvote, downvote or rc manabar. Defaults to [EManabarType.UPVOTE](#upvote)) |

#### Returns

`Promise`\<[`IManabarData`](#interfacesimanabardatamd)\>

Manabar data

#### Defined in

wasm/lib/interfaces.ts:657

___

### calculateManabarFullRegenerationTime

▸ **calculateManabarFullRegenerationTime**(`now`, `maxManaLH`, `currentManaLH`, `lastUpdateTime`): `number`

Calculates full regeneration time of the manabar value for Hive account based on given arguments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `now` | `number` | head block time. Can be obtained using time property from dynamic global properties |
| `maxManaLH` | `string` \| `number` \| `Long` | maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes. For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call. For rc manabar calculations use max_rc value from the rc_accounts API call. |
| `currentManaLH` | `string` \| `number` \| `Long` | current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |
| `lastUpdateTime` | `number` | last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |

#### Returns

`number`

Full regeneration timestamp (in seconds)

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[calculateManabarFullRegenerationTime](#calculatemanabarfullregenerationtime)

#### Defined in

wasm/lib/interfaces.ts:557

___

### calculateManabarFullRegenerationTimeForAccount

▸ **calculateManabarFullRegenerationTimeForAccount**(`account`, `manabarType?`): `Promise`\<`Date`\>

Calculates full regeneration time of the manabar value for Hive account based on given arguments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `string` | account for which we want to calculate manabar full regeneration time |
| `manabarType?` | [`EManabarType`](#enumsemanabartypemd) | manabar type to calculate (can be upvote, downvote or rc manabar. Defaults to [EManabarType.UPVOTE](#upvote)) |

#### Returns

`Promise`\<`Date`\>

Full regeneration time

#### Defined in

wasm/lib/interfaces.ts:667

___

### decrypt

▸ **decrypt**(`wallet`, `encrypted`): `string`

Decrypts given data from the encrypted string in `#encrypted` format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | Wallet with imported encryption keys |
| `encrypted` | `string` | Content to be decoded |

#### Returns

`string`

Decoded content

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[decrypt](#decrypt)

#### Defined in

wasm/lib/interfaces.ts:525

___

### delete

▸ **delete**(): `void`

Deletes the created wax proto_protocol instance

#### Returns

`void`

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[delete](#delete)

#### Defined in

wasm/lib/interfaces.ts:562

___

### encrypt

▸ **encrypt**(`wallet`, `content`, `mainEncryptionKey`, `otherEncryptionKey?`, `nonce?`): `string`

Encrypts given data using two keys and dumps result to the encrypted string in `#encrypted` format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | Wallet with imported mainEncryptionKey and otherEncryptionKey keys |
| `content` | `string` | Content to be encoded |
| `mainEncryptionKey` | `string` | First key to encrypt operations |
| `otherEncryptionKey?` | `string` | Optional second key to encrypt operations |
| `nonce?` | `number` | optional nonce to be explicitly specified for encryption |

#### Returns

`string`

Encrypted content

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[encrypt](#encrypt)

#### Defined in

wasm/lib/interfaces.ts:515

___

### encryptForAccounts

▸ **encryptForAccounts**(`wallet`, `content`, `fromAccount`, `toAccount?`): `Promise`\<`string`\>

Encrypts given data using memo public keys of two accounts and dumps result to the encrypted string in `#encrypted` format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | Wallet with imported fromAccount and toAccount memo public keys |
| `content` | `string` | Content to be encoded |
| `fromAccount` | `string` | first account to retrieve the memo public key used for encryption |
| `toAccount?` | `string` | second account to retrieve the memo public key used for encryption |

#### Returns

`Promise`\<`string`\>

Encrypted content

#### Defined in

wasm/lib/interfaces.ts:621

___

### extend

▸ **extend**\<`YourApi`\>(`extendedHiveApiData`): [`TWaxExtended`](#twaxextended)\<`YourApi`\>

Extends hive chain interface with your custom API definitions

#### Type parameters

| Name |
| :------ |
| `YourApi` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extendedHiveApiData` | `YourApi` | your custom api definitions for use with class-validators and class-transformers |

#### Returns

[`TWaxExtended`](#twaxextended)\<`YourApi`\>

Wax Hive chain instance containing extended api

#### Defined in

wasm/lib/interfaces.ts:640

▸ **extend**\<`YourApi`\>(): [`TWaxExtended`](#twaxextended)\<`YourApi`\>

Extends hive chain interface with your custom API definitions (allows you to call remote endpoints without response validation)

#### Type parameters

| Name |
| :------ |
| `YourApi` |

#### Returns

[`TWaxExtended`](#twaxextended)\<`YourApi`\>

Wax Hive chain instance containing extended api

#### Defined in

wasm/lib/interfaces.ts:647

___

### getAsset

▸ **getAsset**(`nai`): [`IHiveAssetData`](#interfacesihiveassetdatamd)

Retrieves asset amount and symbol from the api data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nai` | [`NaiAsset`](#classesnaiassetmd) | API asset |

#### Returns

[`IHiveAssetData`](#interfacesihiveassetdatamd)

asset data

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[getAsset](#getasset)

#### Defined in

wasm/lib/interfaces.ts:469

___

### getPublicKeyFromSignature

▸ **getPublicKeyFromSignature**(`sigDigest`, `signature`): `string`

Retrieves the public key in wif format from the given sig digest and signature in hexadecimal format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigDigest` | `string` | digest data in hexadecimal format |
| `signature` | `string` | signature in hexadecimal format |

#### Returns

`string`

public key used in the signature

**`Throws`**

on any Wax API-related error

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[getPublicKeyFromSignature](#getpublickeyfromsignature)

#### Defined in

wasm/lib/interfaces.ts:502

___

### getTransactionBuilder

▸ **getTransactionBuilder**(`expirationTime?`): `Promise`\<[`ITransactionBuilder`](#interfacesitransactionbuildermd)\>

Same as [IWaxBaseInterface.TransactionBuilder](#transactionbuilder), but pulls the reference block data from the remote

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `expirationTime?` | [`TTimestamp`](#ttimestamp) | expiration time for the transaction. Applies upon the [ITransactionBuilder.build](#build) call. Can be either any argument parsable by the Date constructor or relative time in seconds, minutes or hours (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.: `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Defaults to `+1m`. Expiration time will be applied when calling any non-push-related method in [ITransactionBuilder](#interfacesitransactionbuildermd) |

#### Returns

`Promise`\<[`ITransactionBuilder`](#interfacesitransactionbuildermd)\>

ready to use transaction builder interface

**`Throws`**

on any Wax API-related error

**`Throws`**

on any Hive API-related error

#### Defined in

wasm/lib/interfaces.ts:609

___

### getVersion

▸ **getVersion**(): `string`

Retrieves the bundled package version string

#### Returns

`string`

application version

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[getVersion](#getversion)

#### Defined in

wasm/lib/interfaces.ts:461

___

### hbd

▸ **hbd**(`amount`): [`NaiAsset`](#classesnaiassetmd)

Retrieves HBD in nai form with given amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | amount of HBD |

#### Returns

[`NaiAsset`](#classesnaiassetmd)

HBD in nai form

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[hbd](#hbd)

#### Defined in

wasm/lib/interfaces.ts:483

___

### hive

▸ **hive**(`amount`): [`NaiAsset`](#classesnaiassetmd)

Retrieves HIVE in nai form with given amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | amount of HIVE |

#### Returns

[`NaiAsset`](#classesnaiassetmd)

HIVE in nai form

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[hive](#hive)

#### Defined in

wasm/lib/interfaces.ts:476

___

### vests

▸ **vests**(`amount`): [`NaiAsset`](#classesnaiassetmd)

Retrieves VESTS in nai form with given amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | amount of VESTS |

#### Returns

[`NaiAsset`](#classesnaiassetmd)

VESTS in nai form

#### Inherited from

[IWaxBaseInterface](#interfacesiwaxbaseinterfacemd).[vests](#vests)

#### Defined in

wasm/lib/interfaces.ts:490


<a name="interfacesimanabardatamd"></a>

# Interface: IManabarData

## Properties

### current

• **current**: `Long`

Current manabar value

#### Defined in

wasm/lib/interfaces.ts:38

___

### max

• **max**: `Long`

Maximum manabar value

#### Defined in

wasm/lib/interfaces.ts:45

___

### percent

• **percent**: `number`

Percent of manabar load with two digits of precision, safely calculated based on the [current](#current) and [max](#max) values (prevents 64-bit Long precision overflow)

#### Defined in

wasm/lib/interfaces.ts:52


<a name="interfacesitransactionbuildermd"></a>

# Interface: ITransactionBuilder

Default Transaction Builder interface for adding operations, using builders and retrieving base information about transaction,
like id, sigDigest and signingKeys. Example usage:

**`Example`**

Base transaction builder usage
```typescript
const tx = new waxFoundation.TransactionBuilder();

tx.push({
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
});
```

## Hierarchy

- `ITransactionBuilderBase`

  ↳ **`ITransactionBuilder`**

## Accessors

### id

• `get` **id**(): `string`

Generates id of the transaction (HF26 serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.id

#### Defined in

wasm/lib/interfaces.ts:105

___

### legacy\_id

• `get` **legacy_id**(): `string`

Generates id of the transaction (legacy serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.legacy\_id

#### Defined in

wasm/lib/interfaces.ts:116

___

### legacy\_sigDigest

• `get` **legacy_sigDigest**(): `string`

Generates digest of the transaction for signing (legacy serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.legacy\_sigDigest

#### Defined in

wasm/lib/interfaces.ts:96

___

### legacy\_signatureKeys

• `get` **legacy_signatureKeys**(): `string`[]

Returns signature keys from the transaction signatures (legacy serialization form is used).

#### Returns

`string`[]

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.legacy\_signatureKeys

#### Defined in

wasm/lib/interfaces.ts:136

___

### sigDigest

• `get` **sigDigest**(): `string`

Generates digest of the transaction for signing (HF26 serialization form is used).

#### Returns

`string`

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.sigDigest

#### Defined in

wasm/lib/interfaces.ts:85

___

### signatureKeys

• `get` **signatureKeys**(): `string`[]

Returns signature keys from the transaction signatures

#### Returns

`string`[]

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.signatureKeys

#### Defined in

wasm/lib/interfaces.ts:125

## Methods

### build

▸ **build**(`wallet`, `publicKey`): [`transaction`](#transaction)

Signs the transaction using given public key and returns the proto transaction. Applies the transaction expiration time

Encrypts operations if any were created using [IEncryptingTransactionBuilder](#interfacesiencryptingtransactionbuildermd) interface

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | unlocked wallet to be used for signing |
| `publicKey` | `string` | publicKey for signing (should be available in the wallet) |

#### Returns

[`transaction`](#transaction)

signed protobuf transaction object

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.build

#### Defined in

wasm/lib/interfaces.ts:198

▸ **build**(`signature`): [`transaction`](#transaction)

Adds your signature to the internal signatures array and returns the proto transaction. Applies the transaction expiration time

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signature` | `string` | signature to add |

#### Returns

[`transaction`](#transaction)

protobuf transaction object

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.build

#### Defined in

wasm/lib/interfaces.ts:209

▸ **build**(): [`transaction`](#transaction)

Returns the proto transaction. Applies the transaction expiration time.

#### Returns

[`transaction`](#transaction)

transaction

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.build

#### Defined in

wasm/lib/interfaces.ts:218

___

### decrypt

▸ **decrypt**(`wallet`): [`transaction`](#transaction)

Decrypts all underlying encrypted operations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | unlocked wallet to be used for decryption |

#### Returns

[`transaction`](#transaction)

protobuf transaction object

**`Throws`**

on any Wax API-related error including validation error

#### Inherited from

ITransactionBuilderBase.decrypt

#### Defined in

wasm/lib/interfaces.ts:147

___

### isSigned

▸ **isSigned**(): `boolean`

Checks if underlying transaction has been already signed at least one time (after [sign](#sign) or [build](#build))

#### Returns

`boolean`

either true or false based on the signatures amount

#### Inherited from

ITransactionBuilderBase.isSigned

#### Defined in

wasm/lib/interfaces.ts:184

___

### push

▸ **push**(`op`): [`ITransactionBuilder`](#interfacesitransactionbuildermd)

Pushes given operation to the operations array in the transaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `op` | [`operation`](#operation) \| [`HiveAppsOperation`](#classeshiveappsoperationmd)\<`any`, `object`\> \| `IBuiltHiveAppsOperation` | operation to append to the transaction (can be hive apps operation) |

#### Returns

[`ITransactionBuilder`](#interfacesitransactionbuildermd)

current transaction builder instance

**`Throws`**

on any Wax API-related error

#### Defined in

wasm/lib/interfaces.ts:279

___

### sign

▸ **sign**(`wallet`, `publicKey`): `string`

Signs the transaction using given public key. Applies the transaction expiration time

Encrypts operations if any were created using [IEncryptingTransactionBuilder](#interfacesiencryptingtransactionbuildermd) interface

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | unlocked wallet to be used for signing |
| `publicKey` | `string` | publicKey for signing (should be available in the wallet) |

#### Returns

`string`

transaction signature signed using given key

**`Throws`**

on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked

#### Inherited from

ITransactionBuilderBase.sign

#### Defined in

wasm/lib/interfaces.ts:177

___

### startEncrypt

▸ **startEncrypt**(`mainEncryptionKey`, `otherEncryptionKey?`, `nonce?`): [`IEncryptingTransactionBuilder`](#interfacesiencryptingtransactionbuildermd)

Starts encryption chain

Remember that in order to encrypt operations with given mainEncryptionKey and optional otherEncryptionKey
you have to import those keys into the wallet passed to the [ITransactionBuilderBase.sign](#sign) or [ITransactionBuilderBase.build](#build) method

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mainEncryptionKey` | `string` | First key to encrypt operations |
| `otherEncryptionKey?` | `string` | Optional second key to encrypt operations |
| `nonce?` | `number` | optional nonce to be explicitly specified for encryption |

#### Returns

[`IEncryptingTransactionBuilder`](#interfacesiencryptingtransactionbuildermd)

current transaction builder instance

#### Defined in

wasm/lib/interfaces.ts:293

___

### toApi

▸ **toApi**(): `string`

Converts the created transaction into the Hive API-form string

#### Returns

`string`

transaction in Hive API-form

**`Throws`**

on any Wax API-related error

#### Inherited from

ITransactionBuilderBase.toApi

#### Defined in

wasm/lib/interfaces.ts:227

___

### toLegacyApi

▸ **toLegacyApi**(): `string`

Converts the created transaction into the Hive API-legacy form JSON string.

Legacy form differs in few aspects to regular (HF26) one:
- for operations type/value dictionary object is replaced by array tuple, where first item points operation type and second operation body
- asset values are encoded in their legacy form having specified token names after amount values, i.e. 1.000 HIVE

Transaction legacy form (even it has shorter JSON code for the first look) is much more error prone, like also
produces **larger binary serialization output**, what is directly stored in blocks. Binary form is the input for signature generation too.
In general, preferred way of generating transactions is HF-26 form (default in this library).

This method is added only for convenience and better cooperation to other transaction processing tools accepting only this form.

#### Returns

`string`

transaction in Legacy Hive API-form

**`Throws`**

on any Wax API-related error

**`Deprecated`**

#### Inherited from

ITransactionBuilderBase.toLegacyApi

#### Defined in

wasm/lib/interfaces.ts:248

___

### toString

▸ **toString**(): `string`

Converts transaction object into the protobuf JSON string

#### Returns

`string`

protobuf JSON string

**`Throws`**

on any Wax API-related error including validation error

#### Inherited from

ITransactionBuilderBase.toString

#### Defined in

wasm/lib/interfaces.ts:163

___

### useBuilder

▸ **useBuilder**\<`TBuilder`\>(`builderConstructor`, `builderFn`, `...constructorArgs`): [`ITransactionBuilder`](#interfacesitransactionbuildermd)

Uses given builder to construct operations and push them to the current instance of the transaction builder

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TBuilder` | extends (...`args`: `any`[]) => `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `builderConstructor` | `TBuilder` | Builder constructor (class) |
| `builderFn` | (`builder`: [`TInterfaceOperationBuilder`](#tinterfaceoperationbuilder)\<`InstanceType`\<`TBuilder`\>\>) => `void` | Lambda function for your builder configuration |
| `...constructorArgs` | `ConstructorParameters`\<`TBuilder`\> | Optional arguments to pass to the builder constructor |

#### Returns

[`ITransactionBuilder`](#interfacesitransactionbuildermd)

current transaction builder instance

**`Throws`**

on any Wax API-related error

**`See`**

 - Operation factories: [ArticleBuilder](#classesarticlebuildermd), [ReplyBuilder](#classesreplybuildermd), [RecurrentTransferPairIdBuilder](#classesrecurrenttransferpairidbuildermd), [RecurrentTransferBuilder](#classesrecurrenttransferbuildermd), [UpdateProposalBuilder](#classesupdateproposalbuildermd)
 - Hive Apps operation builders: [CommunityOperationBuilder](#classescommunityoperationbuildermd), [FollowOperationBuilder](#classesfollowoperationbuildermd), [ResourceCreditsOperationBuilder](#classesresourcecreditsoperationbuildermd)

**`Example`**

Building article
```typescript
 tx.useBuilder(ArticleBuilder, builder => {
     builder.setCategory('blog');
 }, 'gtg', 'My first post', '# Hello world!');
```

#### Defined in

wasm/lib/interfaces.ts:316

___

### validate

▸ **validate**(): `void`

Validates current transaction. Throws on error

#### Returns

`void`

**`Throws`**

on any Wax API-related error including validation error

#### Inherited from

ITransactionBuilderBase.validate

#### Defined in

wasm/lib/interfaces.ts:154


<a name="interfacesitransactionbuilderconstructormd"></a>

# Interface: ITransactionBuilderConstructor

## Constructors

### constructor

• **new ITransactionBuilderConstructor**(`taposBlockId`, `expirationTime`): [`ITransactionBuilder`](#interfacesitransactionbuildermd)

Constructs a new Transaction Builder object with given data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taposBlockId` | [`TBlockHash`](#tblockhash) | reference block id (can be head block id) for TaPoS |
| `expirationTime` | [`TTimestamp`](#ttimestamp) | expiration time for the transaction. Applies upon the [ITransactionBuilder.build](#build) call. Can be either any argument parsable by the Date constructor or relative time in seconds, minutes or hours (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.: `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Expiration time will be applied when calling any non-push-related method in [ITransactionBuilder](#interfacesitransactionbuildermd) |

#### Returns

[`ITransactionBuilder`](#interfacesitransactionbuildermd)

#### Defined in

wasm/lib/interfaces.ts:411

• **new ITransactionBuilderConstructor**(`protoTransaction`): [`ITransactionBuilder`](#interfacesitransactionbuildermd)

Constructs a new Transaction Builder object with ready protobuf transaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protoTransaction` | [`transaction`](#transaction) | protobuf transaction |

#### Returns

[`ITransactionBuilder`](#interfacesitransactionbuildermd)

#### Defined in

wasm/lib/interfaces.ts:418

## Methods

### fromApi

▸ **fromApi**(`transactionObject`): [`ITransactionBuilder`](#interfacesitransactionbuildermd)

Converts Hive API-form transaction in JSON form to our transaction builder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionObject` | `string` \| `object` | transaction object to be converted |

#### Returns

[`ITransactionBuilder`](#interfacesitransactionbuildermd)

transaction builder containing ready to sign transaction (or to convert to protobuf structure using [ITransactionBuilder.build](#build))

**`Throws`**

on any Wax API-related error

#### Defined in

wasm/lib/interfaces.ts:429


<a name="interfacesiwaxbaseinterfacemd"></a>

# Interface: IWaxBaseInterface

## Hierarchy

- **`IWaxBaseInterface`**

  ↳ [`IHiveChainInterface`](#interfacesihivechaininterfacemd)

## Properties

### ASSETS

• `Readonly` **ASSETS**: `Readonly`\<`Record`\<`EAssetName`, [`NaiAsset`](#classesnaiassetmd)\>\>

#### Defined in

wasm/lib/interfaces.ts:451

___

### formatter

• `Readonly` **formatter**: [`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

#### Defined in

wasm/lib/interfaces.ts:453

___

### waxify

• `Readonly` **waxify**: (`strings`: `TemplateStringsArray`, ...`args`: `unknown`[]) => `string`

#### Type declaration

▸ (`strings`, `...args`): `string`

Formats given text based on arguments structure

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strings` | `TemplateStringsArray` | raw strings |
| `...args` | `unknown`[] | arguments to be parsed using custom wax formatters |

##### Returns

`string`

formatted data

**`Example`**

Formatting data
```typescript
formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
```

#### Defined in

wasm/lib/interfaces.ts:454

## Accessors

### TransactionBuilder

• `get` **TransactionBuilder**(): [`ITransactionBuilderConstructor`](#interfacesitransactionbuilderconstructormd)

#### Returns

[`ITransactionBuilderConstructor`](#interfacesitransactionbuilderconstructormd)

#### Defined in

wasm/lib/interfaces.ts:449

## Methods

### calculateCurrentManabarValue

▸ **calculateCurrentManabarValue**(`now`, `maxManaLH`, `currentManaLH`, `lastUpdateTime`): [`IManabarData`](#interfacesimanabardatamd)

Calculates current manabar value for Hive account based on given arguments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `now` | `number` | head block time. Can be obtained using time property from dynamic global properties |
| `maxManaLH` | `string` \| `number` \| `Long` | maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes. For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call. For rc manabar calculations use max_rc value from the rc_accounts API call. |
| `currentManaLH` | `string` \| `number` \| `Long` | current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |
| `lastUpdateTime` | `number` | last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |

#### Returns

[`IManabarData`](#interfacesimanabardatamd)

Manabar data

#### Defined in

wasm/lib/interfaces.ts:541

___

### calculateManabarFullRegenerationTime

▸ **calculateManabarFullRegenerationTime**(`now`, `maxManaLH`, `currentManaLH`, `lastUpdateTime`): `number`

Calculates full regeneration time of the manabar value for Hive account based on given arguments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `now` | `number` | head block time. Can be obtained using time property from dynamic global properties |
| `maxManaLH` | `string` \| `number` \| `Long` | maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes. For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call. For rc manabar calculations use max_rc value from the rc_accounts API call. |
| `currentManaLH` | `string` \| `number` \| `Long` | current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |
| `lastUpdateTime` | `number` | last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes For rc manabar calculations use rc_manabar value from the rc_accounts API call |

#### Returns

`number`

Full regeneration timestamp (in seconds)

#### Defined in

wasm/lib/interfaces.ts:557

___

### decrypt

▸ **decrypt**(`wallet`, `encrypted`): `string`

Decrypts given data from the encrypted string in `#encrypted` format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | Wallet with imported encryption keys |
| `encrypted` | `string` | Content to be decoded |

#### Returns

`string`

Decoded content

#### Defined in

wasm/lib/interfaces.ts:525

___

### delete

▸ **delete**(): `void`

Deletes the created wax proto_protocol instance

#### Returns

`void`

#### Defined in

wasm/lib/interfaces.ts:562

___

### encrypt

▸ **encrypt**(`wallet`, `content`, `mainEncryptionKey`, `otherEncryptionKey?`, `nonce?`): `string`

Encrypts given data using two keys and dumps result to the encrypted string in `#encrypted` format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `wallet` | `IBeekeeperUnlockedWallet` | Wallet with imported mainEncryptionKey and otherEncryptionKey keys |
| `content` | `string` | Content to be encoded |
| `mainEncryptionKey` | `string` | First key to encrypt operations |
| `otherEncryptionKey?` | `string` | Optional second key to encrypt operations |
| `nonce?` | `number` | optional nonce to be explicitly specified for encryption |

#### Returns

`string`

Encrypted content

#### Defined in

wasm/lib/interfaces.ts:515

___

### getAsset

▸ **getAsset**(`nai`): [`IHiveAssetData`](#interfacesihiveassetdatamd)

Retrieves asset amount and symbol from the api data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nai` | [`NaiAsset`](#classesnaiassetmd) | API asset |

#### Returns

[`IHiveAssetData`](#interfacesihiveassetdatamd)

asset data

#### Defined in

wasm/lib/interfaces.ts:469

___

### getPublicKeyFromSignature

▸ **getPublicKeyFromSignature**(`sigDigest`, `signature`): `string`

Retrieves the public key in wif format from the given sig digest and signature in hexadecimal format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigDigest` | `string` | digest data in hexadecimal format |
| `signature` | `string` | signature in hexadecimal format |

#### Returns

`string`

public key used in the signature

**`Throws`**

on any Wax API-related error

#### Defined in

wasm/lib/interfaces.ts:502

___

### getVersion

▸ **getVersion**(): `string`

Retrieves the bundled package version string

#### Returns

`string`

application version

#### Defined in

wasm/lib/interfaces.ts:461

___

### hbd

▸ **hbd**(`amount`): [`NaiAsset`](#classesnaiassetmd)

Retrieves HBD in nai form with given amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | amount of HBD |

#### Returns

[`NaiAsset`](#classesnaiassetmd)

HBD in nai form

#### Defined in

wasm/lib/interfaces.ts:483

___

### hive

▸ **hive**(`amount`): [`NaiAsset`](#classesnaiassetmd)

Retrieves HIVE in nai form with given amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | amount of HIVE |

#### Returns

[`NaiAsset`](#classesnaiassetmd)

HIVE in nai form

#### Defined in

wasm/lib/interfaces.ts:476

___

### vests

▸ **vests**(`amount`): [`NaiAsset`](#classesnaiassetmd)

Retrieves VESTS in nai form with given amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | amount of VESTS |

#### Returns

[`NaiAsset`](#classesnaiassetmd)

VESTS in nai form

#### Defined in

wasm/lib/interfaces.ts:490


<a name="interfacesiwaxcustomformattermd"></a>

# Interface: IWaxCustomFormatter

## Indexable

▪ [key: `string`]: [`TFormatFunction`](#tformatfunction) \| `any`


<a name="interfacesiwaxextendableformattermd"></a>

# Interface: IWaxExtendableFormatter

Classes implementing this interface denote that they are ready to handle tagged templates

## Hierarchy

- [`IWaxFormatter`](#interfacesiwaxformattermd)

  ↳ **`IWaxExtendableFormatter`**

## Implemented by

- [`WaxFormatter`](#classeswaxformattermd)

## Properties

### options

• `Readonly` **options**: `DeepReadonlyObject`\<[`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)\>

Options for the formatter

#### Inherited from

[IWaxFormatter](#interfacesiwaxformattermd).[options](#options)

#### Defined in

wasm/lib/detailed/formatters/types.ts:153

## Methods

### extend

▸ **extend**(`formatterConstructor`, `options?`): [`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

Allows users to extend the default wax formatter using custom user-defined formatters with [WaxFormattable](#waxformattable)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `formatterConstructor` | [`TWaxCustomFormatterConstructor`](#twaxcustomformatterconstructor) | constructable formatter object |
| `options?` | `Partial`\<[`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)\> | formatter options |

#### Returns

[`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

extended formatter class

#### Defined in

wasm/lib/detailed/formatters/types.ts:177

▸ **extend**(`options`): [`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

Allows users to extend the default wax formatter using given options

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`\<[`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)\> | formatter options |

#### Returns

[`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

extended formatter class

#### Defined in

wasm/lib/detailed/formatters/types.ts:185

___

### format

▸ **format**\<`I`, `R`\>(`data`): `R`

Formats given data based on formatter options

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `I` | raw data |

#### Returns

`R`

formatted data

**`Example`**

Formatting data
```typescript
formatter.format(naiObject);
```

#### Inherited from

[IWaxFormatter](#interfacesiwaxformattermd).[format](#format)

#### Defined in

wasm/lib/detailed/formatters/types.ts:148

___

### formatNumber

▸ **formatNumber**(`amount`, `precision?`, `locales?`): `string`

Formats numbers in given format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` \| `BigInt` \| `Long` | number to be formatted |
| `precision?` | `number` | the exact precision of the given number (defaults to undefined - dynamic precision) |
| `locales?` | `string` \| `string`[] | A string with a BCP 47 language, or an array of such locale identifiers (defaults to undefined - current locale) |

#### Returns

`string`

formatted number

#### Defined in

wasm/lib/detailed/formatters/types.ts:196

___

### waxify

▸ **waxify**(`strings`, `...args`): `string`

Formats given text based on arguments structure

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strings` | `TemplateStringsArray` | raw strings |
| `...args` | `unknown`[] | arguments to be parsed using custom wax formatters |

#### Returns

`string`

formatted data

**`Example`**

Formatting data
```typescript
formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
```

#### Inherited from

[IWaxFormatter](#interfacesiwaxformattermd).[waxify](#waxify)

#### Defined in

wasm/lib/detailed/formatters/types.ts:134


<a name="interfacesiwaxformattermd"></a>

# Interface: IWaxFormatter

Classes implementing this interface denote that they are ready to handle tagged templates

## Hierarchy

- **`IWaxFormatter`**

  ↳ [`IWaxExtendableFormatter`](#interfacesiwaxextendableformattermd)

## Implemented by

- [`WaxFormatterBase`](#classeswaxformatterbasemd)

## Properties

### options

• `Readonly` **options**: `DeepReadonlyObject`\<[`IWaxFormatterOptions`](#interfacesiwaxformatteroptionsmd)\>

Options for the formatter

#### Defined in

wasm/lib/detailed/formatters/types.ts:153

## Methods

### format

▸ **format**\<`I`, `R`\>(`data`): `R`

Formats given data based on formatter options

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `any` |
| `R` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `I` | raw data |

#### Returns

`R`

formatted data

**`Example`**

Formatting data
```typescript
formatter.format(naiObject);
```

#### Defined in

wasm/lib/detailed/formatters/types.ts:148

___

### waxify

▸ **waxify**(`strings`, `...args`): `string`

Formats given text based on arguments structure

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strings` | `TemplateStringsArray` | raw strings |
| `...args` | `unknown`[] | arguments to be parsed using custom wax formatters |

#### Returns

`string`

formatted data

**`Example`**

Formatting data
```typescript
formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
```

#### Defined in

wasm/lib/detailed/formatters/types.ts:134


<a name="interfacesiwaxformatteroptionsmd"></a>

# Interface: IWaxFormatterOptions

## Properties

### asset

• **asset**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appendTokenName` | `boolean` | Appends token name after asset amount (e.g. `1.100 HIVE`) **`Default`** ```ts true ``` |
| `displayAsNai` | `boolean` | Displays assets in NAI form instead of the human-readable form **`Default`** ```ts false ``` |
| `formatAmount` | `boolean` | Formats the output amount in human-readable format based on current localization settings of the user (e.g. `100'000'000.100 HIVE`) **`Default`** ```ts true ``` |
| `locales?` | `string` \| `string`[] | Locales to be used when formatting the amount of the asset (defaults to the currently used locale by the user) **`Default`** ```ts undefined ``` |

#### Defined in

wasm/lib/detailed/formatters/types.ts:23

___

### createDefaultFormatters

• **createDefaultFormatters**: `boolean`

Initializes formatter class with default wax formatters

**`Default`**

```ts
true
```

#### Defined in

wasm/lib/detailed/formatters/types.ts:62

___

### transaction

• **transaction**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayAsId` | `boolean` | Displays transactiona as its id (new format) instead of an object **`Default`** ```ts true ``` |

#### Defined in

wasm/lib/detailed/formatters/types.ts:49


<a name="interfacesiwaxoptionsmd"></a>

# Interface: IWaxOptions

## Hierarchy

- **`IWaxOptions`**

  ↳ [`IWaxOptionsChain`](#interfacesiwaxoptionschainmd)

## Properties

### chainId

• **chainId**: `string`

#### Defined in

wasm/lib/interfaces.ts:63


<a name="interfacesiwaxoptionschainmd"></a>

# Interface: IWaxOptionsChain

## Hierarchy

- [`IWaxOptions`](#interfacesiwaxoptionsmd)

  ↳ **`IWaxOptionsChain`**

## Properties

### apiEndpoint

• **apiEndpoint**: `string`

Endpoint for all of the API requests

**`Default`**

```ts
"https://api.hive.blog/"
```

#### Defined in

wasm/lib/interfaces.ts:73

___

### chainId

• **chainId**: `string`

#### Inherited from

[IWaxOptions](#interfacesiwaxoptionsmd).[chainId](#chainid)

#### Defined in

wasm/lib/interfaces.ts:63


<a name="interfacesaccount_createmd"></a>

# Interface: account\_create

A new account may be created only by an existing account.
The account that creates a new account pays a fee.
The fee amount is set by the witnesses.

**`Param`**

Paid by creator. The witnesses decide the amount of the fee. Now, it is 3 HIVE.

**`Param`**

An account that creates a new account.

**`Param`**

Valid account name may consist of many parts separated by a dot,
                                   total may have up to 16 characters, parts have to start from a letter,
                                   may be followed by numbers, or '-'.

**`Param`**

**`Param`**

**`Param`**

**`Param`**

Not authority, public memo key.

**`Param`**

## Properties

### active

• **active**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_create.ts:29

___

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/account_create.ts:26

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/account_create.ts:25

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/proto/account_create.ts:32

___

### memo\_key

• **memo\_key**: `string`

#### Defined in

wasm/lib/proto/account_create.ts:31

___

### new\_account\_name

• **new\_account\_name**: `string`

#### Defined in

wasm/lib/proto/account_create.ts:27

___

### owner

• **owner**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_create.ts:28

___

### posting

• **posting**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_create.ts:30


<a name="interfacesaccount_create_with_delegationmd"></a>

# Interface: account\_create\_with\_delegation

Deprecated.

## Properties

### active

• **active**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:16

___

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:13

___

### delegation

• **delegation**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:12

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:20

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:11

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:19

___

### memo\_key

• **memo\_key**: `string`

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:18

___

### new\_account\_name

• **new\_account\_name**: `string`

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:14

___

### owner

• **owner**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:15

___

### posting

• **posting**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_create_with_delegation.ts:17


<a name="interfacesaccount_createdmd"></a>

# Interface: account\_created

Related to all acts of account creation, that is, creation of genesis accounts as well as operations:
account_create_operation, account_create_with_delegation_operation, pow_operation, pow2_operation and create_claimed_account_operation.
Generated every time one of above operations results in creation of new account (account is always created except for pow/pow2).
Note: vops for genesis accounts are generated at the start of block #1.

**`Param`**

newly created account (receiver of initial_vesting_shares)

**`Param`**

account that initiated new account creation (genesis and mined accounts are their own creators)

**`Param`**

(VESTS) amount of initial vesting on new account (converted from creation fee prior to HF20)

**`Param`**

(VESTS) amount of extra voting power on new account due to delegation

## Properties

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/account_created.ts:20

___

### initial\_delegation

• **initial\_delegation**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/account_created.ts:22

___

### initial\_vesting\_shares

• **initial\_vesting\_shares**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/account_created.ts:21

___

### new\_account\_name

• **new\_account\_name**: `string`

#### Defined in

wasm/lib/proto/account_created.ts:19


<a name="interfacesaccount_updatemd"></a>

# Interface: account\_update

Operations account_update_operation and account_update2_operation share a limit of allowed updates of the owner authority:
two executions per 60 minutes (HIVE_OWNER_UPDATE_LIMIT) (meaning each of them can be executed twice or both can be executed once during that time period).
After 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) using the account recovery process to change the owner authority is no longer possible.
The operation account_update_operation allows changing authorities, it doesn’t allow changing the posting_json_metadata.

**`Param`**

Account name, it cannot be updated.

**`Param`**

In order to update the {owner}, the owner authority is required.
                           It may be changed 2 times per hour.
                           If a user provides a new authority, the old one will be deleted,
                           but the deleted authority may be used up to 30 days in the process of the recovery account.

**`Param`**

In order to update the {active}, the active authority is required.
                            If a user provides a new authority, the old one will be deleted.

**`Param`**

In order to update the {posting}, the active authority is required.
                             If a user provides a new authority, the old one will be deleted.

**`Param`**

In order to update the {memo_key}, active authority is required.
                           If a user provides a new key, the old one will be deleted.

**`Param`**

json_string; in order to update the {json_metadata}, the active authority is required.

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/account_update.ts:27

___

### active

• **active**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_update.ts:29

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/proto/account_update.ts:32

___

### memo\_key

• **memo\_key**: `string`

#### Defined in

wasm/lib/proto/account_update.ts:31

___

### owner

• **owner**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_update.ts:28

___

### posting

• **posting**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_update.ts:30


<a name="interfacesaccount_update2md"></a>

# Interface: account\_update2

There are two operations that allow updating an account data: account_update_operation and account_update2_operation.
Operations account_update_operation and account_update2_operation share a limit of allowed updates
of the owner authority  - two executions per 60 minutes (HIVE_OWNER_UPDATE_LIMIT) - meaning each of them
can be executed twice or both can be executed once during that time period.
After 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) using the account recovery process to change the owner authority is no longer possible.
The operation allows to update authority, json_metadata and the posting_json_metadata.
Depending on what the user wants to change, a different authority has to be used.
Each authority (owner, active, posting, memo_key) consists of:
- weight_threshold
- key or account name with its weight
The authority may have more than one key and more than one assigned account name.

**`Example`**

```ts
Example 1:
The posting authority:
weight_threshold = 1
'first_key', weight = 1
'second_key', weight = 1
'account_name_1', weight = 1
The above settings mean that a user with 'first_key', a user with 'second_key' or a user 'account_name_1'
may post on behalf of this account.
```

**`Example`**

```ts
Example 2:
The posting authority:
weight_threshold = 2
'first_key', weight = 1
'second_key', weight = 1
'account_name_1', weight = 1
The above settings mean that at least two signatures are needed to post on behalf of this account.
```

**`Param`**

Account name, it cannot be updated.

**`Param`**

Optional. In order to update the {owner}, the owner authority is required.
                           It may be changed 2 times per hour.
                           If a user provides a new authority, the old one will be deleted.

**`Param`**

Optional. In order to update the {active}, the active authority is required.
                            If a user provides a new authority, the old one will be deleted.

**`Param`**

Optional. In order to update the {posting}, the active authority is required.
                             If a user provides a new authority, the old one will be deleted.

**`Param`**

Optional. In order to update the {memo_key}, the active authority is required.
                           If a user provides a new key, the old one will be deleted.

**`Param`**

json_string; In order to update the {json_metadata}, the active authority is required.

**`Param`**

json_string; In order to update the { posting_json_metadata },
                                        the posting authority is required.

**`Param`**

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/account_update2.ts:54

___

### active

• **active**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_update2.ts:56

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/account_update2.ts:61

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/proto/account_update2.ts:59

___

### memo\_key

• **memo\_key**: `string`

#### Defined in

wasm/lib/proto/account_update2.ts:58

___

### owner

• **owner**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_update2.ts:55

___

### posting

• **posting**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/account_update2.ts:57

___

### posting\_json\_metadata

• **posting\_json\_metadata**: `string`

#### Defined in

wasm/lib/proto/account_update2.ts:60


<a name="interfacesaccount_witness_proxymd"></a>

# Interface: account\_witness\_proxy

A user may vote for a witness or proposal directly (using an operation: account_witness_vote_operation or update_proposal_votes_operation)
or indirectly (using the proxy - operation:  account_witness_proxy_operation).
If a user sets a proxy, the witness votes are removed and the proposal votes are deactivated.
If a user removes a proxy, there are no witness votes and the proposal votes are activated.
Settings proxy means that a user wants to cede a decision on which witnesses to vote for to an account indicated as {proxy}.
{proxy} will also vote for proposals in the name of {account}.
If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation is not executed
in HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
expired_account_notification_operation is generated.
If the proxy was set and now it is removed, the additionally the virtual operation: proxy_cleared_operation is generated.

**`Param`**

**`Param`**

Account name. To remove the proxy, the parameter should be set empty.
                        Only one proxy may be set for an account.

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/account_witness_proxy.ts:23

___

### proxy

• **proxy**: `string`

#### Defined in

wasm/lib/proto/account_witness_proxy.ts:24


<a name="interfacesaccount_witness_votemd"></a>

# Interface: account\_witness\_vote

A user may vote for a witness directly using an operation:
account_witness_vote_operation or indirectly using the proxy - operation:  account_witness_proxy_operation.
All accounts with a Hive Power (also called Vesting Fund Shares or VESTS) can vote for up to 30 witnesses,
but you cannot vote twice for the same witnesses.
If a proxy is specified then all existing votes are removed.
Your vote power depends on your HP.
If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation
is not executed in a HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
expired_account_notification_operation is generated.

**`Param`**

**`Param`**

Witness account.

**`Param`**

To vote for the witness, the approve = true. To remove the vote, the approve = false.

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/account_witness_vote.ts:22

___

### approve

• **approve**: `boolean`

#### Defined in

wasm/lib/proto/account_witness_vote.ts:24

___

### witness

• **witness**: `string`

#### Defined in

wasm/lib/proto/account_witness_vote.ts:23


<a name="interfacesassetmd"></a>

# Interface: asset

## Properties

### amount

• **amount**: `string`

#### Defined in

wasm/lib/proto/asset.ts:7

___

### nai

• **nai**: `string`

#### Defined in

wasm/lib/proto/asset.ts:9

___

### precision

• **precision**: `number`

#### Defined in

wasm/lib/proto/asset.ts:8


<a name="interfacesauthor_rewardmd"></a>

# Interface: author\_reward

Related to comment_operation.
Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
Note: the reward is the author portion of comment reward lowered by the rewards distributed towards beneficiaries
(therefore it can be zero).

**`See`**

comment_benefactor_reward_operation

**`Param`**

author of the comment (receiver of hbd_payout, hive_payout, vesting_payout)

**`Param`**

permlink of the comment

**`Param`**

(HBD) part of reward

**`Param`**

(HIVE) part of reward

**`Param`**

(VESTS) part of reward

**`Param`**

(VESTS) curators' portion of comment reward (@see curation_reward_operation)

**`Param`**

true if payouts require use of claim_reward_balance_operation

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/author_reward.ts:23

___

### curators\_vesting\_payout

• **curators\_vesting\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/author_reward.ts:28

___

### hbd\_payout

• **hbd\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/author_reward.ts:25

___

### hive\_payout

• **hive\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/author_reward.ts:26

___

### payout\_must\_be\_claimed

• **payout\_must\_be\_claimed**: `boolean`

#### Defined in

wasm/lib/proto/author_reward.ts:29

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/author_reward.ts:24

___

### vesting\_payout

• **vesting\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/author_reward.ts:27


<a name="interfacesauthoritymd"></a>

# Interface: authority

## Properties

### account\_auths

• **account\_auths**: `Object`

#### Index signature

▪ [key: `string`]: `number`

#### Defined in

wasm/lib/proto/authority.ts:8

___

### key\_auths

• **key\_auths**: `Object`

#### Index signature

▪ [key: `string`]: `number`

#### Defined in

wasm/lib/proto/authority.ts:9

___

### weight\_threshold

• **weight\_threshold**: `number`

#### Defined in

wasm/lib/proto/authority.ts:7


<a name="interfacesblockmd"></a>

# Interface: block

## Properties

### block\_id

• **block\_id**: `string`

#### Defined in

wasm/lib/proto/block.ts:27

___

### extensions

• **extensions**: `block_header_extensions`[]

#### Defined in

wasm/lib/proto/block.ts:24

___

### previous

• **previous**: `string`

#### Defined in

wasm/lib/proto/block.ts:20

___

### signing\_key

• **signing\_key**: `string`

#### Defined in

wasm/lib/proto/block.ts:28

___

### timestamp

• **timestamp**: `string`

#### Defined in

wasm/lib/proto/block.ts:21

___

### transaction\_ids

• **transaction\_ids**: `string`[]

#### Defined in

wasm/lib/proto/block.ts:29

___

### transaction\_merkle\_root

• **transaction\_merkle\_root**: `string`

#### Defined in

wasm/lib/proto/block.ts:23

___

### transactions

• **transactions**: [`transaction`](#transaction)[]

#### Defined in

wasm/lib/proto/block.ts:26

___

### witness

• **witness**: `string`

#### Defined in

wasm/lib/proto/block.ts:22

___

### witness\_signature

• **witness\_signature**: `string`

#### Defined in

wasm/lib/proto/block.ts:25


<a name="interfacescancel_transfer_from_savingsmd"></a>

# Interface: cancel\_transfer\_from\_savings

Funds withdrawals from the savings can be canceled at any time before it is executed.

**`Param`**

**`Param`**

## Properties

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/cancel_transfer_from_savings.ts:13

___

### request\_id

• **request\_id**: `number`

#### Defined in

wasm/lib/proto/cancel_transfer_from_savings.ts:14


<a name="interfaceschange_recovery_accountmd"></a>

# Interface: change\_recovery\_account

The operation change_recovery_account_operation allows a user to update their recovery account.
It is important to keep it actual, because only a recovery account may create a request
account recovery in case of compromised the owner authority.
By default the recovery account is set to the account creator or it is empty if it was created by temp account or mined.
In order to cancel the change_recovery_account_operation, the operation change_recovery_account_operation,
the operation should be created with {new_recovery_account} set to the old one.
The operation is done with a 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) delay.

**`Param`**

**`Param`**

**`Param`**

## Properties

### account\_to\_recover

• **account\_to\_recover**: `string`

#### Defined in

wasm/lib/proto/change_recovery_account.ts:21

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/change_recovery_account.ts:23

___

### new\_recovery\_account

• **new\_recovery\_account**: `string`

#### Defined in

wasm/lib/proto/change_recovery_account.ts:22


<a name="interfaceschanged_recovery_accountmd"></a>

# Interface: changed\_recovery\_account

Related to change_recovery_account_operation.
Generated during block processing after wait period for the recovery account change has passed and the change became active.

**`Param`**

used that requested recovery accout change

**`Param`**

previous recovery account

**`Param`**

new recovery account

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/changed_recovery_account.ts:15

___

### new\_recovery\_account

• **new\_recovery\_account**: `string`

#### Defined in

wasm/lib/proto/changed_recovery_account.ts:17

___

### old\_recovery\_account

• **old\_recovery\_account**: `string`

#### Defined in

wasm/lib/proto/changed_recovery_account.ts:16


<a name="interfacesclaim_accountmd"></a>

# Interface: claim\_account

A user may create a new account using a pair of operations: claim_account_operation and create_claimed_account_operation.
After the operation claim_account_operation a user receives a token:
pending claimed accounts and later (using operation create_claimed_account_operation) a user may create a new account.
After executing the operation claim_account_operation, a new account is not created.

**`Param`**

Account name.

**`Param`**

The amount of fee for creating a new account is decided by the witnesses.
                     It may be paid in HIVE or in the Recourse Credit (RC).
                     If a user wants to pay a fee in RC, it should be set {fee= 0}.

**`Param`**

Not currently used.

## Properties

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/claim_account.ts:21

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/claim_account.ts:23

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/claim_account.ts:22


<a name="interfacesclaim_reward_balancemd"></a>

# Interface: claim\_reward\_balance

An operation claim_reward_balance_operation is used to transfer previously collected
author and/or curation rewards from sub balance for the reward to regular balances.
Rewards expressed in Hive and HBD are transferred to liquid balances, rewards in HP increase vesting balance.
When claimed, HP rewards are immediately active towards governance voting power (compare with transfer_to_vesting_operation).

**`Param`**

Account name.

**`Param`**

The amount of Hive reward to be transferred to liquid balance.

**`Param`**

The amount of HBD reward to be transferred to liquid balance

**`Param`**

The amount of HP reward to be transferred to vesting balance.

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/claim_reward_balance.ts:19

___

### reward\_hbd

• **reward\_hbd**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/claim_reward_balance.ts:21

___

### reward\_hive

• **reward\_hive**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/claim_reward_balance.ts:20

___

### reward\_vests

• **reward\_vests**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/claim_reward_balance.ts:22


<a name="interfacesclear_null_account_balancemd"></a>

# Interface: clear\_null\_account\_balance

Related to block processing.
Generated during block processing potentially every block, but only if nonzero assets were burned. Triggered by removal of all
assets from 'null' account balances.

**`Param`**

(HIVE, VESTS or HBD) nonzero assets burned on 'null' account

## Properties

### total\_cleared

• **total\_cleared**: [`asset`](#asset)[]

#### Defined in

wasm/lib/proto/clear_null_account_balance.ts:15


<a name="interfacescollateralized_convertmd"></a>

# Interface: collateralized\_convert

Similar to convert_operation, this operation instructs the blockchain to convert HIVE to HBD.
The operation is performed after 3.5 days, but the owner gets HBD immediately.
The price risk is cushioned by extra HIVE (HIVE_COLLATERAL_RATIO = 200 % ).
After actual conversion takes place the excess HIVE is returned to the owner.

**`Param`**

Account name.

**`Param`**

The number is given by a user. Should be unique for a user.

**`Param`**

Amount > 0, have to be in Hive.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/collateralized_convert.ts:20

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/collateralized_convert.ts:18

___

### requestid

• **requestid**: `number`

#### Defined in

wasm/lib/proto/collateralized_convert.ts:19


<a name="interfacescollateralized_convert_immediate_conversionmd"></a>

# Interface: collateralized\_convert\_immediate\_conversion

Related to collateralized_convert_operation.
Generated every time above operation is executed. Contains amount of HBD received right when the transfer actually happens.

**`See`**

fill_collateralized_convert_request

**`Param`**

user that requested conversion (receiver of hbd_out)

**`Param`**

id of the conversion request

**`Param`**

(HBD) funds after conversion

## Properties

### hbd\_out

• **hbd\_out**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/collateralized_convert_immediate_conversion.ts:19

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/collateralized_convert_immediate_conversion.ts:17

___

### requestid

• **requestid**: `number`

#### Defined in

wasm/lib/proto/collateralized_convert_immediate_conversion.ts:18


<a name="interfacescommentmd"></a>

# Interface: comment

Using comment operation a user may create a post or a comment.
From the blockchain point of view, it is the same operation – always comment.
If a comment has no parent, it is a post.
The parent of the comment may be a post or a comment.
Users may comment their own comments.

**`Param`**

Account name, the author of the commented post or comment.
                                If the operation creates a post, it is empty.
                                It cannot be modified.

**`Param`**

The identifier of the commented post or comment.
                                  When a user creates a post, it may contain the identifier of the community
                                  (e.g. hive-174695) or main tag (e.g. travel).
                                  It cannot be modified.

**`Param`**

Account name, the author of the post or the comment.
                         It cannot be modified.

**`Param`**

Unique to the author, the identifier of the post or comment.
                           It cannot be modified.

**`Param`**

The title of the submitted post, in case of the comment, is often empty.
                        It may be modified.

**`Param`**

The content of the post or the comment.
                       It may be modified.

**`Param`**

There is no blockchain validation on json_metadata,
                                but the structure has been established by the community.
                                From the blockchain point of view it is a json file.
                                For the second layer, the following keys may be used:
                                - app, e.g. peakd/2023.2.3
                                - format, e.g. markdown
                                - tags, e.g. photography
                                - users
                                - images

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/comment.ts:41

___

### body

• **body**: `string`

#### Defined in

wasm/lib/proto/comment.ts:44

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/proto/comment.ts:45

___

### parent\_author

• **parent\_author**: `string`

#### Defined in

wasm/lib/proto/comment.ts:39

___

### parent\_permlink

• **parent\_permlink**: `string`

#### Defined in

wasm/lib/proto/comment.ts:40

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/comment.ts:42

___

### title

• **title**: `string`

#### Defined in

wasm/lib/proto/comment.ts:43


<a name="interfacescomment_benefactor_rewardmd"></a>

# Interface: comment\_benefactor\_reward

Related to comment_operation and comment_options_operation.
Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
Note: the reward is a fragment of the author portion of comment reward depending on share assigned to benefactor
in comment options (can be zero due to rounding).

**`See`**

author_reward

**`Param`**

user assigned to receive share of author reward (receiver of payouts)

**`Param`**

author of the comment

**`Param`**

permlink of the comment

**`Param`**

(HBD) part of reward

**`Param`**

(HIVE) part of reward

**`Param`**

(VESTS) part of reward

**`Param`**

true if payouts require use of claim_reward_balance_operation

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:24

___

### benefactor

• **benefactor**: `string`

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:23

___

### hbd\_payout

• **hbd\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:26

___

### hive\_payout

• **hive\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:27

___

### payout\_must\_be\_claimed

• **payout\_must\_be\_claimed**: `boolean`

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:29

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:25

___

### vesting\_payout

• **vesting\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_benefactor_reward.ts:28


<a name="interfacescomment_optionsmd"></a>

# Interface: comment\_options

The operation comment_options_operation allows to set properties regarding payouts,
rewards or beneficiaries (using {extensions}) for comments.
If the operation: comment_options_operation is done by one of the frontends,
it is usually in the same transaction with the operation: comment_operation.
If a comment has received any votes, only the parameter {percent_hbd} may be changed.

**`Param`**

Account name, the author of the comment.

**`Param`**

The identifier of the comment.

**`Param`**

The maximum value of payout in HBD.
                                     Default value: max_accepted_payout = asset( 1000000000, HBD_SYMBOL ).
                                     The allowed value should be less than the default value.
                                     If max_accepted_payout = 0, then voters and authors will not receive the payout.

**`Param`**

By default the author reward is paid 50% HP and 50 % HBD.
                              In some rare situations, instead of HBD, the Hive may be paid.
                              percent_hbd = HIVE_100_PERCENT means that 100 % of HBD part is paid in HBD.
                              A user may decide how many percent of HBD (from 50 %) they wants to receive in the HBD,
                              the rest will be paid out in HP.
                              Default value: percent_hbd = HIVE_100_PERCENT.
                              The allowed value should be less than the default value.
                              This is the only parameter that can be modified after the comment receives any vote.

**`Param`**

The flag that allows to decide whether the comment may receive a vote.
                            Default value: allow_votes = true.

**`Param`**

The flag that allows to decide whether the voters for the comment should
                                       receive the curation rewards. Rewards return to the reward fund.
                                       Default value: allow_curation_rewards = true.

**`Param`**

It may contain the list of the beneficiaries,
                                                the accounts that should receive the author reward.
                                                The list consists of the account name and the weight of the shares in the author reward.
                                                If the sum of the weights is less than 100%,
                                                the rest of the reward is received by the author.
                                                It should be defined less than 128 accounts.
                                                The allowed range of the weight is from 0 to 10000 (0 – 100%).
                                                The beneficiaries should be listed in alphabetical order, no duplicates.

## Properties

### allow\_curation\_rewards

• **allow\_curation\_rewards**: `boolean`

#### Defined in

wasm/lib/proto/comment_options.ts:61

___

### allow\_votes

• **allow\_votes**: `boolean`

#### Defined in

wasm/lib/proto/comment_options.ts:60

___

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/comment_options.ts:56

___

### extensions

• **extensions**: `comment_options_extension`[]

#### Defined in

wasm/lib/proto/comment_options.ts:62

___

### max\_accepted\_payout

• **max\_accepted\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_options.ts:58

___

### percent\_hbd

• **percent\_hbd**: `number`

#### Defined in

wasm/lib/proto/comment_options.ts:59

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/comment_options.ts:57


<a name="interfacescomment_payout_updatemd"></a>

# Interface: comment\_payout\_update

Related to comment_operation.
Generated during block processing after cashout time passes even if there are no rewards.
Note: prior to HF17 comment could have multiple cashout windows.

**`Param`**

author of comment

**`Param`**

permlink of comment

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/comment_payout_update.ts:15

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/comment_payout_update.ts:16


<a name="interfacescomment_rewardmd"></a>

# Interface: comment\_reward

Related to comment_operation.
Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
Note: for informational purposes only, shows summary of comment reward, does not indicate any transfers.

**`See`**

 - curation_reward_operation
 - comment_benefactor_reward_operation
 - author_reward_operation

**`Param`**

author of the comment

**`Param`**

permlink of the comment

**`Param`**

(HBD) total value of comment reward recalculated to HBD

**`Param`**

(HIVE satoshi) raw author reward (@see author_reward_operation) [is it needed?]

**`Param`**

(HBD) overall author reward (from multiple cashouts prior to HF17) recalculated to HBD [is it needed?]

**`Param`**

(HBD) overall curation reward (from multiple cashouts prior to HF17) recalculated to HBD [is it needed?]

**`Param`**

(HBD) overall beneficiary reward (from multiple cashouts prior to HF17) recalculated to HBD [is it needed?]

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/comment_reward.ts:25

___

### author\_rewards

• **author\_rewards**: `string`

#### Defined in

wasm/lib/proto/comment_reward.ts:28

___

### beneficiary\_payout\_value

• **beneficiary\_payout\_value**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_reward.ts:31

___

### curator\_payout\_value

• **curator\_payout\_value**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_reward.ts:30

___

### payout

• **payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_reward.ts:27

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/comment_reward.ts:26

___

### total\_payout\_value

• **total\_payout\_value**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/comment_reward.ts:29


<a name="interfacesconsolidate_treasury_balancemd"></a>

# Interface: consolidate\_treasury\_balance

Related to block processing.
Generated during block processing potentially every block, but only if there is nonzero transfer. Transfer occurs
if there are assets on OBSOLETE_TREASURY_ACCOUNT ('steem.dao'). They are consolidated from all balances (per asset
type) and moved to NEW_HIVE_TREASURY_ACCOUNT ('hive.fund').

**`Param`**

(HIVE, VESTS or HBD) funds moved from old to new treasury

## Properties

### total\_moved

• **total\_moved**: [`asset`](#asset)[]

#### Defined in

wasm/lib/proto/consolidate_treasury_balance.ts:16


<a name="interfacesconvertmd"></a>

# Interface: convert

This operation instructs the blockchain to start a conversion of HBD to Hive.
The funds are deposited after 3.5 days.

**`Param`**

Account name.

**`Param`**

The number is given by a user. Should be unique for a user.

**`Param`**

Amount > 0, have to be in HBD.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/convert.ts:18

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/convert.ts:16

___

### requestid

• **requestid**: `number`

#### Defined in

wasm/lib/proto/convert.ts:17


<a name="interfacescreate_claimed_accountmd"></a>

# Interface: create\_claimed\_account

The operation create_claimed_account_operation may be used by the user who has the token.
Pending claimed accounts (see claim_account_operation).
After executing the operation create_claimed_account_operation, a new account is created.

**`Param`**

An account who create a new account.

**`Param`**

Account name.
                                   Valid account name may consist of many parts separated by a dot,
                                   total may have up to 16 characters, parts have to start from a letter,
                                   may be followed by numbers, or “-“.

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

Json string.

**`Param`**

Not currently used.

## Properties

### active

• **active**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/create_claimed_account.ts:29

___

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/create_claimed_account.ts:26

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/create_claimed_account.ts:33

___

### json\_metadata

• **json\_metadata**: `string`

#### Defined in

wasm/lib/proto/create_claimed_account.ts:32

___

### memo\_key

• **memo\_key**: `string`

#### Defined in

wasm/lib/proto/create_claimed_account.ts:31

___

### new\_account\_name

• **new\_account\_name**: `string`

#### Defined in

wasm/lib/proto/create_claimed_account.ts:27

___

### owner

• **owner**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/create_claimed_account.ts:28

___

### posting

• **posting**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/create_claimed_account.ts:30


<a name="interfacescreate_proposalmd"></a>

# Interface: create\_proposal

There is a Decentralized Hive Fund (DHF) on the Hive.
Users may submit proposals for funding and if the proposal receives enough votes, it will be funded.
In order to create a proposal user should create a post first and then marked it as
a proposal with the operation create_proposal_operation.
User defines when the proposal starts and ends and how many funds need to realize it.
The creating proposal costs 10 HBD and additionally 1 HBD for each day over 60 days. The fee goes back to DHF.
Every hour all active proposals are processed and taking into consideration a current number of votes payments are done.
Accounts can create/remove votes anytime.

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

## Properties

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/create_proposal.ts:28

___

### daily\_pay

• **daily\_pay**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/create_proposal.ts:32

___

### end\_date

• **end\_date**: `string`

#### Defined in

wasm/lib/proto/create_proposal.ts:31

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/create_proposal.ts:35

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/create_proposal.ts:34

___

### receiver

• **receiver**: `string`

#### Defined in

wasm/lib/proto/create_proposal.ts:29

___

### start\_date

• **start\_date**: `string`

#### Defined in

wasm/lib/proto/create_proposal.ts:30

___

### subject

• **subject**: `string`

#### Defined in

wasm/lib/proto/create_proposal.ts:33


<a name="interfacescuration_rewardmd"></a>

# Interface: curation\_reward

Related to comment_operation and comment_vote_operation.
Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
Note: the reward is a fragment of curators' portion of comment reward depending on share of particular curator in overall
curation power for the comment. Only generated when nonzero.

**`Param`**

user that curated the comment (receiver of reward)

**`Param`**

(VESTS) curation reward

**`Param`**

author of curated comment

**`Param`**

permlink of curated comment

**`Param`**

true if payouts require use of claim_reward_balance_operation

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/curation_reward.ts:22

___

### curator

• **curator**: `string`

#### Defined in

wasm/lib/proto/curation_reward.ts:20

___

### payout\_must\_be\_claimed

• **payout\_must\_be\_claimed**: `boolean`

#### Defined in

wasm/lib/proto/curation_reward.ts:24

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/curation_reward.ts:23

___

### reward

• **reward**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/curation_reward.ts:21


<a name="interfacescustommd"></a>

# Interface: custom

There are the following custom operations: custom_operation, custom_json_operation and custom_binary (currently is disabled).
The operation: custom_operation provides a generic way to add higher level protocols on top of witness consensus operations.

**`Param`**

**`Param`**

**`Param`**

## Properties

### data

• **data**: `string`

#### Defined in

wasm/lib/proto/custom.ts:17

___

### id

• **id**: `number`

#### Defined in

wasm/lib/proto/custom.ts:16

___

### required\_auths

• **required\_auths**: `string`[]

#### Defined in

wasm/lib/proto/custom.ts:15


<a name="interfacescustom_jsonmd"></a>

# Interface: custom\_json

The operation custom_json_operation works similar as custom_operation,
but it is designed to be human readable/developer friendly.
The custom_json_operation is larger than custom_operation or custom_binary, that is why it costs more RC.
It should be signed as required in { required_auths } or { required_posting_auths }.
The examples of custom_json_operation:
- reblog
- muted
- pinned
- follow

**`Param`**

**`Param`**

**`Param`**

Must be less than 32 characters long.

**`Param`**

Must be a proper utf8 JSON string.

## Properties

### id

• **id**: `string`

#### Defined in

wasm/lib/proto/custom_json.ts:25

___

### json

• **json**: `string`

#### Defined in

wasm/lib/proto/custom_json.ts:26

___

### required\_auths

• **required\_auths**: `string`[]

#### Defined in

wasm/lib/proto/custom_json.ts:23

___

### required\_posting\_auths

• **required\_posting\_auths**: `string`[]

#### Defined in

wasm/lib/proto/custom_json.ts:24


<a name="interfacesdecline_voting_rightsmd"></a>

# Interface: decline\_voting\_rights

Using the operation decline_voting_rights_operation, a user may decide to decline
their voting rights – for content, witnesses and proposals.
Additionally, a user cannot set a proxy (operation account_witness_proxy_operation).
The operation is done with a HIVE_OWNER_AUTH_RECOVERY_PERIOD day delay.
After HIVE_OWNER_AUTH_RECOVERY_PERIOD days it is irreversible.
During HIVE_OWNER_AUTH_RECOVERY_PERIOD days after creation, the operation may be canceled
using the operation declive_voting_rights_operation with {decline = false}.

**`Param`**

Account name.

**`Param`**

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/decline_voting_rights.ts:19

___

### decline

• **decline**: `boolean`

#### Defined in

wasm/lib/proto/decline_voting_rights.ts:20


<a name="interfacesdeclined_voting_rightsmd"></a>

# Interface: declined\_voting\_rights

It's related to `decline_voting_rights_operation` and generated after `HIVE_OWNER_AUTH_RECOVERY_PERIOD` interval.
Then some actions are done and after that `declined_voting_rights_operation` is created.

**`Param`**

user who decided to decline his voting rights

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/declined_voting_rights.ts:13


<a name="interfacesdelayed_votingmd"></a>

# Interface: delayed\_voting

Related to transfer_to_vesting_operation.
Generated during block processing every time part of fairly fresh VESTS becomes active part of governance vote for the account.
Note: after account receives new VESTS there is a grace period before those VESTS are accounted for when
it comes to governance vote power. This vop is generated at the end of that period.

**`Param`**

account with fairly fresh VESTS

**`Param`**

(VESTS satoshi) new governance vote power that just activated for voter

## Properties

### voter

• **voter**: `string`

#### Defined in

wasm/lib/proto/delayed_voting.ts:17

___

### votes

• **votes**: `string`

#### Defined in

wasm/lib/proto/delayed_voting.ts:18


<a name="interfacesdelegate_vesting_sharesmd"></a>

# Interface: delegate\_vesting\_shares

The operation delegate_vesting_shares_operation allows to delegate an amount
of { vesting_shares } to an { delegatee } account. The { vesting_shares } are still owned by { delegator },
but the voting rights and resource credit are transferred.
A user may not delegate:
- the vesting shares that are already delegated
- the delegated vesting shares to him (a user does not own them)
- the vesting shares in the Power down process
- the already used voting shares for voting or downvoting
In order to remove the vesting shares delegation, the operation delegate_vesting_shares_operation
should be created with {vesting_shares = 0}. When a delegation is removed, the delegated vesting shares
are frozen for five days (HIVE_DELEGATION_RETURN_PERIOD_HF20) to prevent voting twice.

**`Param`**

The account delegating vesting shares.

**`Param`**

The account receiving vesting shares.

**`Param`**

The amount of vesting shares to be delegated.
                                Minimal amount = 1/3 of the fee for creating a new account.

## Properties

### delegatee

• **delegatee**: `string`

#### Defined in

wasm/lib/proto/delegate_vesting_shares.ts:27

___

### delegator

• **delegator**: `string`

#### Defined in

wasm/lib/proto/delegate_vesting_shares.ts:26

___

### vesting\_shares

• **vesting\_shares**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/delegate_vesting_shares.ts:28


<a name="interfacesdelete_commentmd"></a>

# Interface: delete\_comment

The post or comment may be deleted by the author. If the post or comment is deleted, the {permlink} may be reused.
The delete doesn’t mean that the comment is removed from the blockchain.

**`Param`**

Account name, the author of the post or the comment.

**`Param`**

The identifier of the post or the comment.

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/delete_comment.ts:14

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/delete_comment.ts:15


<a name="interfacesdhf_conversionmd"></a>

# Interface: dhf\_conversion

Related to specific case of transfer_operation and to block processing.
When user transferred HIVE to treasury the amount is immediately converted to HBD and this vops is generated.
Also generated during block processing every day during daily proposal maintenance.
Note: portion of HIVE on treasury balance is converted to HBD and thus increases funds available for proposals.

**`Param`**

treasury (source of hive_amount_in and receiver of hbd_amount_out)

**`Param`**

(HIVE) source of conversion

**`Param`**

(HBD) effect of conversion

## Properties

### hbd\_amount\_out

• **hbd\_amount\_out**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/dhf_conversion.ts:20

___

### hive\_amount\_in

• **hive\_amount\_in**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/dhf_conversion.ts:19

___

### treasury

• **treasury**: `string`

#### Defined in

wasm/lib/proto/dhf_conversion.ts:18


<a name="interfacesdhf_fundingmd"></a>

# Interface: dhf\_funding

Related to block processing.
Generated during block processing every proposal maintenance period.
Note: while the fund receives part of inflation every block, the amount is recorded aside and only when there are
proposal payouts (when new funds matter), there is generation of this vop.

**`Param`**

treasury account (receiver of additional_funds)

**`Param`**

(HBD) portion inflation accumulated since previous maintenance period

## Properties

### additional\_funds

• **additional\_funds**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/dhf_funding.ts:18

___

### treasury

• **treasury**: `string`

#### Defined in

wasm/lib/proto/dhf_funding.ts:17


<a name="interfaceseffective_comment_votemd"></a>

# Interface: effective\_comment\_vote

Related to vote_operation.
Generated every time vote is cast for the first time or edited, but only as long as it is effective, that is,
the target comment was not yet cashed out.

**`Param`**

account that casts a vote

**`Param`**

author of comment voted on

**`Param`**

permlink of comment voted on

**`Param`**

weight of vote depending on when vote was cast and with what power

**`Param`**

power of the vote

**`Param`**

sum of all vote weights on the target comment in the moment of casting current vote

**`Param`**

(HBD) estimated reward on target comment; supplemented by AH RocksDB plugin

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:23

___

### pending\_payout

• **pending\_payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:28

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:24

___

### rshares

• **rshares**: `string`

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:26

___

### total\_vote\_weight

• **total\_vote\_weight**: `string`

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:27

___

### voter

• **voter**: `string`

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:22

___

### weight

• **weight**: `string`

#### Defined in

wasm/lib/proto/effective_comment_vote.ts:25


<a name="interfacesescrow_approvemd"></a>

# Interface: escrow\_approve

The operation escrow_approve_operation is used to approve the escrow.
The approval should be done by { to } and by the { agent }.
The escrow approval is irreversible.
If { agent } or { to } haven’t approved the escrow before the { ratification_deadline} or either
of them explicitly rejected the escrow, the escrow is rejected.
If {agent} and {to} have approved the escrow, the {fee} is transferred from temporary balance to {agent} account.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

Account name. Either {to} or {agent}.

**`Param`**

Escrow identifier.

**`Param`**

approve = true; (approve = false explicitly rejects the escrow)

## Properties

### agent

• **agent**: `string`

#### Defined in

wasm/lib/proto/escrow_approve.ts:24

___

### approve

• **approve**: `boolean`

#### Defined in

wasm/lib/proto/escrow_approve.ts:27

___

### escrow\_id

• **escrow\_id**: `number`

#### Defined in

wasm/lib/proto/escrow_approve.ts:26

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_approve.ts:22

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_approve.ts:23

___

### who

• **who**: `string`

#### Defined in

wasm/lib/proto/escrow_approve.ts:25


<a name="interfacesescrow_approvedmd"></a>

# Interface: escrow\_approved

Related to escrow_approve_operation.
Generated when both agent and to accounts approved pending escrow transfer (agent receives fee).

**`See`**

escrow_rejected

**`Param`**

user that initiated escrow transfer

**`Param`**

user that is target of pending escrow transfer

**`Param`**

user that is an agent of pending escrow transfer (receiver of fee)

**`Param`**

id of escrow transfer

**`Param`**

(HIVE of HBD) fee paid to agent

## Properties

### agent

• **agent**: `string`

#### Defined in

wasm/lib/proto/escrow_approved.ts:21

___

### escrow\_id

• **escrow\_id**: `number`

#### Defined in

wasm/lib/proto/escrow_approved.ts:22

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_approved.ts:23

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_approved.ts:19

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_approved.ts:20


<a name="interfacesescrow_disputemd"></a>

# Interface: escrow\_dispute

The operation  escrow_dispute_operation is used to raise the dispute. It may be used by { from } or { to } accounts.
If there is a dispute, only {agent} may release the funds.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

Account name. Either {to} or {agent}.

**`Param`**

Escrow identifier.

## Properties

### agent

• **agent**: `string`

#### Defined in

wasm/lib/proto/escrow_dispute.ts:19

___

### escrow\_id

• **escrow\_id**: `number`

#### Defined in

wasm/lib/proto/escrow_dispute.ts:21

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_dispute.ts:17

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_dispute.ts:18

___

### who

• **who**: `string`

#### Defined in

wasm/lib/proto/escrow_dispute.ts:20


<a name="interfacesescrow_rejectedmd"></a>

# Interface: escrow\_rejected

Related to escrow_approve_operation and escrow_transfer_operation.
Generated when pending escrow transfer is cancelled and user that initiated it receives all the funds back.
It can happen with explicit rejection with use of first operation. Can also happen during block processing when either
agent or to account failed to approve before ratification deadline.

**`See`**

escrow_approved

**`Param`**

user that initiated escrow transfer (receiver of all the funds)

**`Param`**

user that was target of cancelled escrow transfer

**`Param`**

user that was designated as agent of cancelled escrow transfer

**`Param`**

id of cancelled escrow transfer

**`Param`**

(HBD) funds from cancelled escrow transfer (same amount as in escrow_transfer_operation)

**`Param`**

(HIVE) funds from cancelled escrow transfer (same amount as in escrow_transfer_operation)

**`Param`**

(HIVE of HBD) fee from cancelled escrow transfer (same amount as in escrow_transfer_operation)

## Properties

### agent

• **agent**: `string`

#### Defined in

wasm/lib/proto/escrow_rejected.ts:25

___

### escrow\_id

• **escrow\_id**: `number`

#### Defined in

wasm/lib/proto/escrow_rejected.ts:26

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_rejected.ts:29

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_rejected.ts:23

___

### hbd\_amount

• **hbd\_amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_rejected.ts:27

___

### hive\_amount

• **hive\_amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_rejected.ts:28

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_rejected.ts:24


<a name="interfacesescrow_releasemd"></a>

# Interface: escrow\_release

The operation is used to release the funds of the escrow.
The escrow may be released by { from }, { to } or { agent } – depending on the following conditions:
If there is no dispute and escrow has not expired, either party can release funds to the other.
If escrow expires and there is no dispute, either party can release funds to either party.
If there is a dispute regardless of expiration, the agent can release funds to either party
following whichever agreement was in place between the parties.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

The account that is attempting to release the funds.

**`Param`**

The account that should receive funds (might be {from}, might be {to}).

**`Param`**

Escrow indicator.

**`Param`**

The amount of HBD to release.

**`Param`**

The amount of HIVE to release.

## Properties

### agent

• **agent**: `string`

#### Defined in

wasm/lib/proto/escrow_release.ts:27

___

### escrow\_id

• **escrow\_id**: `number`

#### Defined in

wasm/lib/proto/escrow_release.ts:30

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_release.ts:25

___

### hbd\_amount

• **hbd\_amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_release.ts:31

___

### hive\_amount

• **hive\_amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_release.ts:32

___

### receiver

• **receiver**: `string`

#### Defined in

wasm/lib/proto/escrow_release.ts:29

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_release.ts:26

___

### who

• **who**: `string`

#### Defined in

wasm/lib/proto/escrow_release.ts:28


<a name="interfacesescrow_transfermd"></a>

# Interface: escrow\_transfer

The escrow allows the account { from_account } to send money to an account { to_account }
only if the agreed terms will be fulfilled. In case of dispute { agent } may divide the funds
between { from } and { to }. The escrow lasts up to { escrow_expiration }.
When the escrow is created, the funds are transferred {from} to a temporary account.
The funds are on the temporary balance, till the operation escrow_release_operation is created.
To create an valid escrow:
1. Sender { from } creates the escrow using the operation: escrow_transfer_operation indicated  { to } and { agent }.
2. The { agent } and { to } have up to { ratification_deadline } for approving the escrow using operation: escrow_approve_operation.
If there is a dispute, the operation: escrow_dispute_operation should be used.
In case of the escrow releases, the operation: escrow_release_operation should be used.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

Account name.

**`Param`**

It is defined by the sender. It should be unique for { from }.

**`Param`**

Escrow amount.

**`Param`**

Escrow amount.

**`Param`**

The fee amount depends on the agent. The fee is paid to the agent when approved.

**`Param`**

Time for approval for { to } and { agent }.
                                        If the escrow is not approved till { ratification_deadline },
                                        it will be rejected and all funds returned to { from }.

**`Param`**

See description of escrow_release_operation.

**`Param`**

json string.

## Properties

### agent

• **agent**: `string`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:35

___

### escrow\_expiration

• **escrow\_expiration**: `string`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:41

___

### escrow\_id

• **escrow\_id**: `number`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:36

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_transfer.ts:39

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:33

___

### hbd\_amount

• **hbd\_amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_transfer.ts:37

___

### hive\_amount

• **hive\_amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/escrow_transfer.ts:38

___

### json\_meta

• **json\_meta**: `string`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:42

___

### ratification\_deadline

• **ratification\_deadline**: `string`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:40

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/escrow_transfer.ts:34


<a name="interfacesexpired_account_notificationmd"></a>

# Interface: expired\_account\_notification

Related to governance voting: account_witness_vote_operation, account_witness_proxy_operation and update_proposal_votes_operation.
Generated during block processing when user did not cast any governance vote for very long time. Such user is considered not
interested in governance and therefore his previous votes are nullified.

**`Param`**

user whose governance votes were nullified

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/expired_account_notification.ts:14


<a name="interfacesfailed_recurrent_transfermd"></a>

# Interface: failed\_recurrent\_transfer

Related to recurrent_transfer_operation.
Generated during block processing instead of fill_recurrent_transfer_operation when there is not enought funds on from account.
Note: failed transfers are not automatically repeated.
Note: if too many consecutive transfers fail, whole recurrent transfer operation is discontinued.

**`See`**

fill_recurrent_transfer

**`Param`**

user that initiated the transfer (source of amount that has not enough balance to cover it)

**`Param`**

user that is target of transfer (would be receiver of amount, but no transfer actually happened)

**`Param`**

(HIVE of HBD) amount that was scheduled for transferred in current iteration but failed

**`Param`**

memo attached to the transfer

**`Param`**

number of failed iterations

**`Param`**

number of remaining pending transfers

**`Param`**

true if whole recurrent transfer was discontinued due to too many consecutive failures

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:25

___

### consecutive\_failures

• **consecutive\_failures**: `number`

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:27

___

### deleted

• **deleted**: `boolean`

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:29

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:23

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:26

___

### remaining\_executions

• **remaining\_executions**: `number`

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:28

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/failed_recurrent_transfer.ts:24


<a name="interfacesfeed_publishmd"></a>

# Interface: feed\_publish

This is an operation for witnesses.
The witnesses publish the exchange rate between Hive and HBD.
Only the exchange rate published by the top 20 witnesses is used to define the exchange rate.

**`Param`**

The witness.

**`Param`**

How many HBD the 1 Hive should cost
                               Example: "base":"0.345 HBD","quote":"1.000 HIVE"

## Properties

### exchange\_rate

• **exchange\_rate**: `undefined` \| [`price`](#price)

#### Defined in

wasm/lib/proto/feed_publish.ts:18

___

### publisher

• **publisher**: `string`

#### Defined in

wasm/lib/proto/feed_publish.ts:17


<a name="interfacesfill_collateralized_convert_requestmd"></a>

# Interface: fill\_collateralized\_convert\_request

Related to collateralized_convert_operation.
Generated during block processing after conversion delay passes and HIVE is finally converted to HBD.
Note: HBD is transferred immediately during execution of above operation, this vop is generated after actual
price of conversion becomes known.

**`See`**

collateralized_convert_immediate_conversion

**`Param`**

user that requested conversion (receiver of excess_collateral)

**`Param`**

id of the request

**`Param`**

(HIVE) source of conversion (part of collateral)

**`Param`**

(HBD) result of conversion (already transferred to owner when request was made)

**`Param`**

(HIVE) unused part of collateral returned to owner

## Properties

### amount\_in

• **amount\_in**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_collateralized_convert_request.ts:23

___

### amount\_out

• **amount\_out**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_collateralized_convert_request.ts:24

___

### excess\_collateral

• **excess\_collateral**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_collateralized_convert_request.ts:25

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/fill_collateralized_convert_request.ts:21

___

### requestid

• **requestid**: `number`

#### Defined in

wasm/lib/proto/fill_collateralized_convert_request.ts:22


<a name="interfacesfill_convert_requestmd"></a>

# Interface: fill\_convert\_request

Related to convert_operation.
Generated during block processing after conversion delay passes and HBD is converted to HIVE.

**`Param`**

User that requested conversion (receiver of amount_out).

**`Param`**

id of the request.

**`Param`**

(HBD) source of conversion.

**`Param`**

(HIVE) effect of conversion.

## Properties

### amount\_in

• **amount\_in**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_convert_request.ts:19

___

### amount\_out

• **amount\_out**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_convert_request.ts:20

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/fill_convert_request.ts:17

___

### requestid

• **requestid**: `number`

#### Defined in

wasm/lib/proto/fill_convert_request.ts:18


<a name="interfacesfill_ordermd"></a>

# Interface: fill\_order

Related to limit_order_create_operation and limit_order_create2_operation.
Generated during one of above operations when order on internal market is partially or fully matched
(each match generates separate vop).

**`Param`**

user that recently created order (taker - receiver of open_pays)

**`Param`**

id of fresh order

**`Param`**

(HIVE or HBD) amount paid to open_owner

**`Param`**

user that had his order on the market (maker - receiver of current_pays)

**`Param`**

id of waiting order

**`Param`**

(HBD or HIVE) amount paid to current_owner

## Properties

### current\_orderid

• **current\_orderid**: `number`

#### Defined in

wasm/lib/proto/fill_order.ts:21

___

### current\_owner

• **current\_owner**: `string`

#### Defined in

wasm/lib/proto/fill_order.ts:20

___

### current\_pays

• **current\_pays**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_order.ts:22

___

### open\_orderid

• **open\_orderid**: `number`

#### Defined in

wasm/lib/proto/fill_order.ts:24

___

### open\_owner

• **open\_owner**: `string`

#### Defined in

wasm/lib/proto/fill_order.ts:23

___

### open\_pays

• **open\_pays**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_order.ts:25


<a name="interfacesfill_recurrent_transfermd"></a>

# Interface: fill\_recurrent\_transfer

Related to recurrent_transfer_operation.
Generated during block processing starting in the block that included above operation and then after every period
set in the operation until all transfers are executed, too many fail due to shortfall of funds or the transfer is cancelled.
Note: in case of accumulation of very big amount of recurrent transfers to be executed in particular block, some
are going to be postponed to next block(s) and so will be generation of this vop.

**`See`**

failed_recurrent_transfer

**`Param`**

user that initiated the transfer (source of amount)

**`Param`**

user that is target of transfer (receiver of amount)

**`Param`**

(HIVE of HBD) amount transferred in current iteration

**`Param`**

memo attached to the transfer

**`Param`**

number of remaining pending transfers

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_recurrent_transfer.ts:24

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/fill_recurrent_transfer.ts:22

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/fill_recurrent_transfer.ts:25

___

### remaining\_executions

• **remaining\_executions**: `number`

#### Defined in

wasm/lib/proto/fill_recurrent_transfer.ts:26

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/fill_recurrent_transfer.ts:23


<a name="interfacesfill_transfer_from_savingsmd"></a>

# Interface: fill\_transfer\_from\_savings

Related to transfer_from_savings_operation.
Generated during block processing after savings withdraw time has passed and requested amount
was transfered from savings to liquid balance.

**`Param`**

user that initiated transfer from savings

**`Param`**

user that was specified to receive funds (receiver of amount)

**`Param`**

(HIVE or HBD) funds transfered from savings

**`Param`**

id of transfer request

**`Param`**

memo attached to transfer request

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_transfer_from_savings.ts:21

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/fill_transfer_from_savings.ts:19

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/fill_transfer_from_savings.ts:23

___

### request\_id

• **request\_id**: `number`

#### Defined in

wasm/lib/proto/fill_transfer_from_savings.ts:22

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/fill_transfer_from_savings.ts:20


<a name="interfacesfill_vesting_withdrawmd"></a>

# Interface: fill\_vesting\_withdraw

Related to withdraw_vesting_operation and set_withdraw_vesting_route_operation.
Generated during block processing in batches for each active withdraw route (including implied
from_account(VESTS)->from_account(HIVE)) each time vesting withdrawal period passes.
Note: not generated for implied route when all funds were already distributed along explicit routes

**`Param`**

user that activated power down

**`Param`**

target of vesting route (potentially the same as from_account - receiver of deposited)

**`Param`**

(VESTS) source amount

**`Param`**

(HIVE or VESTS) [converted] target amount

## Properties

### deposited

• **deposited**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_vesting_withdraw.ts:22

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/fill_vesting_withdraw.ts:19

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/fill_vesting_withdraw.ts:20

___

### withdrawn

• **withdrawn**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/fill_vesting_withdraw.ts:21


<a name="interfacesfuture_extensionsmd"></a>

# Interface: future\_extensions

## Properties

### void\_t

• `Optional` **void\_t**: `void_t`

#### Defined in

wasm/lib/proto/future_extensions.ts:10


<a name="interfaceshardforkmd"></a>

# Interface: hardfork

Related to block processing.
Generated during block processing every time new hardfork is activated. Many related vops can follow.

**`Param`**

number of hardfork

## Properties

### hardfork\_id

• **hardfork\_id**: `number`

#### Defined in

wasm/lib/proto/hardfork.ts:13


<a name="interfaceshardfork_hivemd"></a>

# Interface: hardfork\_hive

Related to hardfork 23 (HIVE inception hardfork).
Generated for every account that did not receive HIVE airdrop.

**`Param`**

account excluded from airdrop (source of amounts for airdrop)

**`Param`**

treasury that received airdrop instead of account (receiver of funds)

**`Param`**

delegatees that lost delegations from account - filled before pre notification

**`Param`**

(HBD) part of airdrop to treasury (sourced from various HBD balances on account)

**`Param`**

(HIVE) part of airdrop to treasury (sourced from various HIVE balances on account)

**`Param`**

(VESTS) sum of all sources of VESTS on account

**`Param`**

(HIVE) part of airdrop to treasury (sourced from conversion of vests_converted)

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/hardfork_hive.ts:20

___

### hbd\_transferred

• **hbd\_transferred**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/hardfork_hive.ts:23

___

### hive\_transferred

• **hive\_transferred**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/hardfork_hive.ts:24

___

### other\_affected\_accounts

• **other\_affected\_accounts**: `string`[]

#### Defined in

wasm/lib/proto/hardfork_hive.ts:22

___

### total\_hive\_from\_vests

• **total\_hive\_from\_vests**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/hardfork_hive.ts:26

___

### treasury

• **treasury**: `string`

#### Defined in

wasm/lib/proto/hardfork_hive.ts:21

___

### vests\_converted

• **vests\_converted**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/hardfork_hive.ts:25


<a name="interfaceshardfork_hive_restoremd"></a>

# Interface: hardfork\_hive\_restore

Related to hardfork 24.
Generated for every account that was excluded from HF23 airdrop but won appeal.
Note: the late airdrop did not apply properly since HIVE that the accounts should receive did not account for
HIVE from converted VESTS. [how was it resolved?]

**`See`**

hardfork_hive

**`Param`**

account to receive late airdrop (receiver of funds)

**`Param`**

treasury, source of late airdrop

**`Param`**

(HBD) part of airdrop (equals related hardfork_hive_operation.hbd_transferred)

**`Param`**

(HIVE) part of airdrop (equals related hardfork_hive_operation.hive_transferred)

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/hardfork_hive_restore.ts:20

___

### hbd\_transferred

• **hbd\_transferred**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/hardfork_hive_restore.ts:22

___

### hive\_transferred

• **hive\_transferred**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/hardfork_hive_restore.ts:23

___

### treasury

• **treasury**: `string`

#### Defined in

wasm/lib/proto/hardfork_hive_restore.ts:21


<a name="interfacesineffective_delete_commentmd"></a>

# Interface: ineffective\_delete\_comment

Related to delete_comment_operation.
Generated when delete_comment_operation was executed but ignored.
Note: prior to HF19 it was possible to execute delete on comment that had net positive votes. Such operation was ignored.
This is the moment this vop is generated.

**`Param`**

author of attempted-delete comment

**`Param`**

permlink of attempted-delete comment

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/ineffective_delete_comment.ts:16

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/ineffective_delete_comment.ts:17


<a name="interfacesinterestmd"></a>

# Interface: interest

Related to any operation that modifies HBD liquid or savings balance (including block processing).
Generated when operation modified HBD balance and account received interest payment.
Interest is stored in related balance (liquid when liquid was modified, savings when savings was modified).
Note: since HF25 interest is not calculated nor paid on liquid balance.

**`Param`**

user that had his HBD balance modified (receiver of interest)

**`Param`**

(HBD) amount of interest paid

**`Param`**

true when liquid balance was modified (not happening after HF25)

## Properties

### interest

• **interest**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/interest.ts:19

___

### is\_saved\_into\_hbd\_balance

• **is\_saved\_into\_hbd\_balance**: `boolean`

#### Defined in

wasm/lib/proto/interest.ts:20

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/interest.ts:18


<a name="interfaceslegacy_chain_propertiesmd"></a>

# Interface: legacy\_chain\_properties

Witnesses must vote on how to set certain chain properties to ensure a smooth
and well functioning network.  Any time owner is in the active set of witnesses these
properties will be used to control the blockchain configuration.

**`Param`**

This fee, paid in HIVE, is converted into VESTS for the new account.
                                      Accounts without vesting shares cannot earn usage rations and therefore are powerless.
                                      This minimum fee requires all accounts to have some kind of commitment
                                      to the network that includes the ability to vote and make transactions.

**`Param`**

This witnesses vote for the maximum_block_size which is used by the network to tune rate limiting and capacity.

**`Param`**

## Properties

### account\_creation\_fee

• **account\_creation\_fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/legacy_chain_properties.ts:20

___

### hbd\_interest\_rate

• **hbd\_interest\_rate**: `number`

#### Defined in

wasm/lib/proto/legacy_chain_properties.ts:22

___

### maximum\_block\_size

• **maximum\_block\_size**: `number`

#### Defined in

wasm/lib/proto/legacy_chain_properties.ts:21


<a name="interfaceslimit_order_cancelmd"></a>

# Interface: limit\_order\_cancel

Cancels an order (limit_order_create_operation or limit_order_create2_operation)
and returns the balance to the owner.

**`Param`**

**`Param`**

The request_id provided by a user during creating a limit_order_create_operation
                          or limit_order_create2_operation.

## Properties

### orderid

• **orderid**: `number`

#### Defined in

wasm/lib/proto/limit_order_cancel.ts:16

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/limit_order_cancel.ts:15


<a name="interfaceslimit_order_cancelledmd"></a>

# Interface: limit\_order\_cancelled

Related to limit_order_cancel_operation, limit_order_create_operation or limit_order_create2_operation.
Generated every time existing limit order is cancelled. It happens on explicit call (first operation), or in rare case of
filling limit order (second or third operation) when, after filling most of it, remaining funds are too small (would round
to zero when sold). Finally also generated during block processing for orders that reached expiration time without being filled.

**`See`**

fill_order

**`Param`**

user that placed an order (receiver of amount_back)

**`Param`**

id of the order

**`Param`**

(HIVE or HBD) remaining funds from original order that were not traded until cancellation

## Properties

### amount\_back

• **amount\_back**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/limit_order_cancelled.ts:21

___

### orderid

• **orderid**: `number`

#### Defined in

wasm/lib/proto/limit_order_cancelled.ts:20

___

### seller

• **seller**: `string`

#### Defined in

wasm/lib/proto/limit_order_cancelled.ts:19


<a name="interfaceslimit_order_createmd"></a>

# Interface: limit\_order\_create

This operation creates a limit order and matches it against existing open orders.
It allows to sell Hive and buy HBD or sell HBD and buy Hive.
It is a way for a user to declare they want to sell {amount_to_sell} Hive/HBD for at least {min_to_receive} HBD/Hive.
The user may be a taker (if a user creates an order and the order matches some order(s))
or a maker (if a user creates an order and the order doesn’t match and the order is waiting for a match on the market).
If there is a partial match, a user may be a taker and maker for the same order.
If a taker creates an order for all orders on the market the order(s) that are the best deal for the taker are matched.
If there are two orders with the same price, the older one is matched.
The operation is used by the markets see: https://wallet.hive.blog/market

**`Param`**

**`Param`**

an ID assigned by owner, must be unique.

**`Param`**

**`Param`**

**`Param`**

If fill_or_kill = true, then the operation is executed immediately or it fails
                             (the operation is not added to the block).
                             If fill_or_kill = false, then the order is valid till 'expiration'.

**`Param`**

## Properties

### amount\_to\_sell

• **amount\_to\_sell**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/limit_order_create.ts:30

___

### expiration

• **expiration**: `string`

#### Defined in

wasm/lib/proto/limit_order_create.ts:33

___

### fill\_or\_kill

• **fill\_or\_kill**: `boolean`

#### Defined in

wasm/lib/proto/limit_order_create.ts:32

___

### min\_to\_receive

• **min\_to\_receive**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/limit_order_create.ts:31

___

### orderid

• **orderid**: `number`

#### Defined in

wasm/lib/proto/limit_order_create.ts:29

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/limit_order_create.ts:28


<a name="interfaceslimit_order_create2md"></a>

# Interface: limit\_order\_create2

This operation creates a limit order and matches it against existing open orders.
It is similar to limit_order_create except it serializes the price rather than calculating it from other fields.
It allows to sell Hive and buy HBD or sell HBD and buy Hive.
It is a way for a user to declare they wants to sell {amount_to_sell} Hive/HBD for at least {exchange_rate}  per HBD/Hive.

**`Param`**

**`Param`**

an ID assigned by owner, must be unique.

**`Param`**

**`Param`**

If fill_or_kill = true, then the operation is executed immediately
                             or it fails (the operation is not added to the block).
                             If fill_or_kill = false, then the order is valid till {expiration}.

**`Param`**

**`Param`**

## Properties

### amount\_to\_sell

• **amount\_to\_sell**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/limit_order_create2.ts:26

___

### exchange\_rate

• **exchange\_rate**: `undefined` \| [`price`](#price)

#### Defined in

wasm/lib/proto/limit_order_create2.ts:28

___

### expiration

• **expiration**: `string`

#### Defined in

wasm/lib/proto/limit_order_create2.ts:29

___

### fill\_or\_kill

• **fill\_or\_kill**: `boolean`

#### Defined in

wasm/lib/proto/limit_order_create2.ts:27

___

### orderid

• **orderid**: `number`

#### Defined in

wasm/lib/proto/limit_order_create2.ts:25

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/limit_order_create2.ts:24


<a name="interfacesliquidity_rewardmd"></a>

# Interface: liquidity\_reward

Related to limit_order_create_operation and limit_order_create2_operation.
Generated during block processing to indicate reward paid to the market makers on internal HIVE<->HBD market.
No longer active after HF12.

**`See`**

fill_order_operation

**`Param`**

market maker (receiver of payout)

**`Param`**

(HIVE) reward for provided liquidity

## Properties

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/liquidity_reward.ts:17

___

### payout

• **payout**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/liquidity_reward.ts:18


<a name="interfacesoperationmd"></a>

# Interface: operation

NOTE: do not change the order of any operations prior to the virtual operations
or it will trigger a hardfork.

## Properties

### account\_create

• `Optional` **account\_create**: [`account_create`](#account_create)

#### Defined in

wasm/lib/proto/operation.ts:110

___

### account\_create\_with\_delegation

• `Optional` **account\_create\_with\_delegation**: [`account_create_with_delegation`](#account_create_with_delegation)

#### Defined in

wasm/lib/proto/operation.ts:139

___

### account\_created

• `Optional` **account\_created**: [`account_created`](#account_created)

#### Defined in

wasm/lib/proto/operation.ts:181

___

### account\_update

• `Optional` **account\_update**: [`account_update`](#account_update)

#### Defined in

wasm/lib/proto/operation.ts:111

___

### account\_update2

• `Optional` **account\_update2**: [`account_update2`](#account_update2)

#### Defined in

wasm/lib/proto/operation.ts:141

___

### account\_witness\_proxy

• `Optional` **account\_witness\_proxy**: [`account_witness_proxy`](#account_witness_proxy)

#### Defined in

wasm/lib/proto/operation.ts:114

___

### account\_witness\_vote

• `Optional` **account\_witness\_vote**: [`account_witness_vote`](#account_witness_vote)

#### Defined in

wasm/lib/proto/operation.ts:113

___

### author\_reward

• `Optional` **author\_reward**: [`author_reward`](#author_reward)

#### Defined in

wasm/lib/proto/operation.ts:152

___

### cancel\_transfer\_from\_savings

• `Optional` **cancel\_transfer\_from\_savings**: [`cancel_transfer_from_savings`](#cancel_transfer_from_savings)

#### Defined in

wasm/lib/proto/operation.ts:135

___

### change\_recovery\_account

• `Optional` **change\_recovery\_account**: [`change_recovery_account`](#change_recovery_account)

#### Defined in

wasm/lib/proto/operation.ts:127

___

### changed\_recovery\_account

• `Optional` **changed\_recovery\_account**: [`changed_recovery_account`](#changed_recovery_account)

#### Defined in

wasm/lib/proto/operation.ts:177

___

### claim\_account

• `Optional` **claim\_account**: [`claim_account`](#claim_account)

#### Defined in

wasm/lib/proto/operation.ts:123

___

### claim\_reward\_balance

• `Optional` **claim\_reward\_balance**: [`claim_reward_balance`](#claim_reward_balance)

#### Defined in

wasm/lib/proto/operation.ts:137

___

### clear\_null\_account\_balance

• `Optional` **clear\_null\_account\_balance**: [`clear_null_account_balance`](#clear_null_account_balance)

#### Defined in

wasm/lib/proto/operation.ts:166

___

### collateralized\_convert

• `Optional` **collateralized\_convert**: [`collateralized_convert`](#collateralized_convert)

#### Defined in

wasm/lib/proto/operation.ts:146

___

### collateralized\_convert\_immediate\_conversion

• `Optional` **collateralized\_convert\_immediate\_conversion**: [`collateralized_convert_immediate_conversion`](#collateralized_convert_immediate_conversion)

#### Defined in

wasm/lib/proto/operation.ts:189

___

### comment

• `Optional` **comment**: [`comment`](#comment)

#### Defined in

wasm/lib/proto/operation.ts:102

___

### comment\_benefactor\_reward

• `Optional` **comment\_benefactor\_reward**: [`comment_benefactor_reward`](#comment_benefactor_reward)

#### Defined in

wasm/lib/proto/operation.ts:164

___

### comment\_options

• `Optional` **comment\_options**: [`comment_options`](#comment_options)

#### Defined in

wasm/lib/proto/operation.ts:120

___

### comment\_payout\_update

• `Optional` **comment\_payout\_update**: [`comment_payout_update`](#comment_payout_update)

#### Defined in

wasm/lib/proto/operation.ts:162

___

### comment\_reward

• `Optional` **comment\_reward**: [`comment_reward`](#comment_reward)

#### Defined in

wasm/lib/proto/operation.ts:154

___

### consolidate\_treasury\_balance

• `Optional` **consolidate\_treasury\_balance**: [`consolidate_treasury_balance`](#consolidate_treasury_balance)

#### Defined in

wasm/lib/proto/operation.ts:172

___

### convert

• `Optional` **convert**: [`convert`](#convert)

#### Defined in

wasm/lib/proto/operation.ts:109

___

### create\_claimed\_account

• `Optional` **create\_claimed\_account**: [`create_claimed_account`](#create_claimed_account)

#### Defined in

wasm/lib/proto/operation.ts:124

___

### create\_proposal

• `Optional` **create\_proposal**: [`create_proposal`](#create_proposal)

#### Defined in

wasm/lib/proto/operation.ts:142

___

### curation\_reward

• `Optional` **curation\_reward**: [`curation_reward`](#curation_reward)

#### Defined in

wasm/lib/proto/operation.ts:153

___

### custom

• `Optional` **custom**: [`custom`](#custom)

#### Defined in

wasm/lib/proto/operation.ts:116

___

### custom\_json

• `Optional` **custom\_json**: [`custom_json`](#custom_json)

#### Defined in

wasm/lib/proto/operation.ts:119

___

### decline\_voting\_rights

• `Optional` **decline\_voting\_rights**: [`decline_voting_rights`](#decline_voting_rights)

#### Defined in

wasm/lib/proto/operation.ts:136

___

### declined\_voting\_rights

• `Optional` **declined\_voting\_rights**: [`declined_voting_rights`](#declined_voting_rights)

#### Defined in

wasm/lib/proto/operation.ts:193

___

### delayed\_voting

• `Optional` **delayed\_voting**: [`delayed_voting`](#delayed_voting)

#### Defined in

wasm/lib/proto/operation.ts:171

___

### delegate\_vesting\_shares

• `Optional` **delegate\_vesting\_shares**: [`delegate_vesting_shares`](#delegate_vesting_shares)

#### Defined in

wasm/lib/proto/operation.ts:138

___

### delete\_comment

• `Optional` **delete\_comment**: [`delete_comment`](#delete_comment)

#### Defined in

wasm/lib/proto/operation.ts:118

___

### dhf\_conversion

• `Optional` **dhf\_conversion**: [`dhf_conversion`](#dhf_conversion)

#### Defined in

wasm/lib/proto/operation.ts:175

___

### dhf\_funding

• `Optional` **dhf\_funding**: [`dhf_funding`](#dhf_funding)

#### Defined in

wasm/lib/proto/operation.ts:168

___

### effective\_comment\_vote

• `Optional` **effective\_comment\_vote**: [`effective_comment_vote`](#effective_comment_vote)

#### Defined in

wasm/lib/proto/operation.ts:173

___

### escrow\_approve

• `Optional` **escrow\_approve**: [`escrow_approve`](#escrow_approve)

#### Defined in

wasm/lib/proto/operation.ts:132

___

### escrow\_approved

• `Optional` **escrow\_approved**: [`escrow_approved`](#escrow_approved)

#### Defined in

wasm/lib/proto/operation.ts:190

___

### escrow\_dispute

• `Optional` **escrow\_dispute**: [`escrow_dispute`](#escrow_dispute)

#### Defined in

wasm/lib/proto/operation.ts:129

___

### escrow\_rejected

• `Optional` **escrow\_rejected**: [`escrow_rejected`](#escrow_rejected)

#### Defined in

wasm/lib/proto/operation.ts:191

___

### escrow\_release

• `Optional` **escrow\_release**: [`escrow_release`](#escrow_release)

#### Defined in

wasm/lib/proto/operation.ts:130

___

### escrow\_transfer

• `Optional` **escrow\_transfer**: [`escrow_transfer`](#escrow_transfer)

#### Defined in

wasm/lib/proto/operation.ts:128

___

### expired\_account\_notification

• `Optional` **expired\_account\_notification**: [`expired_account_notification`](#expired_account_notification)

#### Defined in

wasm/lib/proto/operation.ts:176

___

### failed\_recurrent\_transfer

• `Optional` **failed\_recurrent\_transfer**: [`failed_recurrent_transfer`](#failed_recurrent_transfer)

#### Defined in

wasm/lib/proto/operation.ts:185

___

### feed\_publish

• `Optional` **feed\_publish**: [`feed_publish`](#feed_publish)

#### Defined in

wasm/lib/proto/operation.ts:108

___

### fill\_collateralized\_convert\_request

• `Optional` **fill\_collateralized\_convert\_request**: [`fill_collateralized_convert_request`](#fill_collateralized_convert_request)

#### Defined in

wasm/lib/proto/operation.ts:182

___

### fill\_convert\_request

• `Optional` **fill\_convert\_request**: [`fill_convert_request`](#fill_convert_request)

Virtual operations:

#### Defined in

wasm/lib/proto/operation.ts:151

___

### fill\_order

• `Optional` **fill\_order**: [`fill_order`](#fill_order)

#### Defined in

wasm/lib/proto/operation.ts:158

___

### fill\_recurrent\_transfer

• `Optional` **fill\_recurrent\_transfer**: [`fill_recurrent_transfer`](#fill_recurrent_transfer)

#### Defined in

wasm/lib/proto/operation.ts:184

___

### fill\_transfer\_from\_savings

• `Optional` **fill\_transfer\_from\_savings**: [`fill_transfer_from_savings`](#fill_transfer_from_savings)

#### Defined in

wasm/lib/proto/operation.ts:160

___

### fill\_vesting\_withdraw

• `Optional` **fill\_vesting\_withdraw**: [`fill_vesting_withdraw`](#fill_vesting_withdraw)

#### Defined in

wasm/lib/proto/operation.ts:157

___

### hardfork

• `Optional` **hardfork**: [`hardfork`](#hardfork)

#### Defined in

wasm/lib/proto/operation.ts:161

___

### hardfork\_hive

• `Optional` **hardfork\_hive**: [`hardfork_hive`](#hardfork_hive)

#### Defined in

wasm/lib/proto/operation.ts:169

___

### hardfork\_hive\_restore

• `Optional` **hardfork\_hive\_restore**: [`hardfork_hive_restore`](#hardfork_hive_restore)

#### Defined in

wasm/lib/proto/operation.ts:170

___

### ineffective\_delete\_comment

• `Optional` **ineffective\_delete\_comment**: [`ineffective_delete_comment`](#ineffective_delete_comment)

#### Defined in

wasm/lib/proto/operation.ts:174

___

### interest

• `Optional` **interest**: [`interest`](#interest)

#### Defined in

wasm/lib/proto/operation.ts:156

___

### limit\_order\_cancel

• `Optional` **limit\_order\_cancel**: [`limit_order_cancel`](#limit_order_cancel)

#### Defined in

wasm/lib/proto/operation.ts:107

___

### limit\_order\_cancelled

• `Optional` **limit\_order\_cancelled**: [`limit_order_cancelled`](#limit_order_cancelled)

#### Defined in

wasm/lib/proto/operation.ts:186

___

### limit\_order\_create

• `Optional` **limit\_order\_create**: [`limit_order_create`](#limit_order_create)

#### Defined in

wasm/lib/proto/operation.ts:106

___

### limit\_order\_create2

• `Optional` **limit\_order\_create2**: [`limit_order_create2`](#limit_order_create2)

#### Defined in

wasm/lib/proto/operation.ts:122

___

### liquidity\_reward

• `Optional` **liquidity\_reward**: [`liquidity_reward`](#liquidity_reward)

#### Defined in

wasm/lib/proto/operation.ts:155

___

### pow

• `Optional` **pow**: [`pow`](#pow)

#### Defined in

wasm/lib/proto/operation.ts:115

___

### pow2

• `Optional` **pow2**: [`pow2`](#pow2)

#### Defined in

wasm/lib/proto/operation.ts:131

___

### pow\_reward

• `Optional` **pow\_reward**: [`pow_reward`](#pow_reward)

#### Defined in

wasm/lib/proto/operation.ts:179

___

### producer\_missed

• `Optional` **producer\_missed**: [`producer_missed`](#producer_missed)

#### Defined in

wasm/lib/proto/operation.ts:187

___

### producer\_reward

• `Optional` **producer\_reward**: [`producer_reward`](#producer_reward)

#### Defined in

wasm/lib/proto/operation.ts:165

___

### proposal\_fee

• `Optional` **proposal\_fee**: [`proposal_fee`](#proposal_fee)

#### Defined in

wasm/lib/proto/operation.ts:188

___

### proposal\_pay

• `Optional` **proposal\_pay**: [`proposal_pay`](#proposal_pay)

#### Defined in

wasm/lib/proto/operation.ts:167

___

### proxy\_cleared

• `Optional` **proxy\_cleared**: [`proxy_cleared`](#proxy_cleared)

#### Defined in

wasm/lib/proto/operation.ts:192

___

### recover\_account

• `Optional` **recover\_account**: [`recover_account`](#recover_account)

#### Defined in

wasm/lib/proto/operation.ts:126

___

### recurrent\_transfer

• `Optional` **recurrent\_transfer**: [`recurrent_transfer`](#recurrent_transfer)

#### Defined in

wasm/lib/proto/operation.ts:147

___

### remove\_proposal

• `Optional` **remove\_proposal**: [`remove_proposal`](#remove_proposal)

#### Defined in

wasm/lib/proto/operation.ts:144

___

### request\_account\_recovery

• `Optional` **request\_account\_recovery**: [`request_account_recovery`](#request_account_recovery)

#### Defined in

wasm/lib/proto/operation.ts:125

___

### return\_vesting\_delegation

• `Optional` **return\_vesting\_delegation**: [`return_vesting_delegation`](#return_vesting_delegation)

#### Defined in

wasm/lib/proto/operation.ts:163

___

### set\_withdraw\_vesting\_route

• `Optional` **set\_withdraw\_vesting\_route**: [`set_withdraw_vesting_route`](#set_withdraw_vesting_route)

#### Defined in

wasm/lib/proto/operation.ts:121

___

### shutdown\_witness

• `Optional` **shutdown\_witness**: [`shutdown_witness`](#shutdown_witness)

#### Defined in

wasm/lib/proto/operation.ts:159

___

### system\_warning

• `Optional` **system\_warning**: [`system_warning`](#system_warning)

#### Defined in

wasm/lib/proto/operation.ts:183

___

### transfer

• `Optional` **transfer**: [`transfer`](#transfer)

#### Defined in

wasm/lib/proto/operation.ts:103

___

### transfer\_from\_savings

• `Optional` **transfer\_from\_savings**: [`transfer_from_savings`](#transfer_from_savings)

#### Defined in

wasm/lib/proto/operation.ts:134

___

### transfer\_to\_savings

• `Optional` **transfer\_to\_savings**: [`transfer_to_savings`](#transfer_to_savings)

#### Defined in

wasm/lib/proto/operation.ts:133

___

### transfer\_to\_vesting

• `Optional` **transfer\_to\_vesting**: [`transfer_to_vesting`](#transfer_to_vesting)

#### Defined in

wasm/lib/proto/operation.ts:104

___

### transfer\_to\_vesting\_completed

• `Optional` **transfer\_to\_vesting\_completed**: [`transfer_to_vesting_completed`](#transfer_to_vesting_completed)

#### Defined in

wasm/lib/proto/operation.ts:178

___

### update\_proposal

• `Optional` **update\_proposal**: [`update_proposal`](#update_proposal)

#### Defined in

wasm/lib/proto/operation.ts:145

___

### update\_proposal\_votes

• `Optional` **update\_proposal\_votes**: [`update_proposal_votes`](#update_proposal_votes)

#### Defined in

wasm/lib/proto/operation.ts:143

___

### vesting\_shares\_split

• `Optional` **vesting\_shares\_split**: [`vesting_shares_split`](#vesting_shares_split)

#### Defined in

wasm/lib/proto/operation.ts:180

___

### vote

• `Optional` **vote**: [`vote`](#vote)

#### Defined in

wasm/lib/proto/operation.ts:101

___

### withdraw\_vesting

• `Optional` **withdraw\_vesting**: [`withdraw_vesting`](#withdraw_vesting)

#### Defined in

wasm/lib/proto/operation.ts:105

___

### witness\_block\_approve

• `Optional` **witness\_block\_approve**: [`witness_block_approve`](#witness_block_approve)

#### Defined in

wasm/lib/proto/operation.ts:117

___

### witness\_set\_properties

• `Optional` **witness\_set\_properties**: [`witness_set_properties`](#witness_set_properties)

#### Defined in

wasm/lib/proto/operation.ts:140

___

### witness\_update

• `Optional` **witness\_update**: [`witness_update`](#witness_update)

#### Defined in

wasm/lib/proto/operation.ts:112


<a name="interfacespowmd"></a>

# Interface: pow

## Properties

### block\_id

• **block\_id**: `string`

#### Defined in

wasm/lib/proto/pow.ts:17

___

### nonce

• **nonce**: `string`

#### Defined in

wasm/lib/proto/pow.ts:18

___

### props

• **props**: `undefined` \| [`legacy_chain_properties`](#legacy_chain_properties)

#### Defined in

wasm/lib/proto/pow.ts:20

___

### work

• **work**: `undefined` \| `pow_work`

#### Defined in

wasm/lib/proto/pow.ts:19

___

### worker\_account

• **worker\_account**: `string`

#### Defined in

wasm/lib/proto/pow.ts:16


<a name="interfacespow2md"></a>

# Interface: pow2

## Properties

### new\_owner\_key

• **new\_owner\_key**: `string`

#### Defined in

wasm/lib/proto/pow2.ts:40

___

### props

• **props**: `undefined` \| [`legacy_chain_properties`](#legacy_chain_properties)

#### Defined in

wasm/lib/proto/pow2.ts:41

___

### work

• **work**: `undefined` \| `pow2_work`

#### Defined in

wasm/lib/proto/pow2.ts:39


<a name="interfacespow_rewardmd"></a>

# Interface: pow\_reward

Related to pow_operation and pow2_operation.
Generated every time one of above operations is executed (up to HF16).
Note: pow2_operation could be executed up to HF17 but mining rewards were stopped after HF16.

**`Param`**

(potentially new) witness that calculated PoW (receiver of reward)

**`Param`**

(VESTS or HIVE) reward for work (HIVE only during first 30 days after genesis)

## Properties

### reward

• **reward**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/pow_reward.ts:17

___

### worker

• **worker**: `string`

#### Defined in

wasm/lib/proto/pow_reward.ts:16


<a name="interfacespricemd"></a>

# Interface: price

Represents quotation of the relative value of asset against another asset.
Similar to 'currency pair' used to determine value of currencies.

For example:
1 EUR / 1.25 USD where:
1 EUR is an asset specified as a base
1.25 USD us an asset specified as a qute

can determine value of EUR against USD.

**`Param`**

Represents a value of the price object to be expressed relatively to quote asset.
                      Cannot have amount == 0 if you want to build valid price.

**`Param`**

represents an relative asset. Cannot have amount == 0, otherwise asertion fail.

## Properties

### base

• **base**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/price.ts:23

___

### quote

• **quote**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/price.ts:24


<a name="interfacesproducer_missedmd"></a>

# Interface: producer\_missed

Related to block processing.
Generated during block processing when witness failed to produce his block on time.

**`See`**

shutdown_witness

**`Param`**

witness that failed to produce his block on time

## Properties

### producer

• **producer**: `string`

#### Defined in

wasm/lib/proto/producer_missed.ts:14


<a name="interfacesproducer_rewardmd"></a>

# Interface: producer\_reward

Related to block processing.
Generated during block processing every block for current witness.

**`Param`**

witness (receiver of vesting_shares)

**`Param`**

(VESTS or HIVE) reward for block production (HIVE only during first 30 days after genesis)

## Properties

### producer

• **producer**: `string`

#### Defined in

wasm/lib/proto/producer_reward.ts:15

___

### vesting\_shares

• **vesting\_shares**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/producer_reward.ts:16


<a name="interfacesproposal_feemd"></a>

# Interface: proposal\_fee

Related to create_proposal_operation.
Generated every time above operation is executed. Supplements it with paid fee.

**`Param`**

user that created proposal (source of fee)

**`Param`**

treasury account (receiver of fee)

**`Param`**

id of proposal

**`Param`**

(HBD) amount paid for proposal [should actually be part of create_proposal_operation but it's too late now]

## Properties

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/proposal_fee.ts:17

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/proposal_fee.ts:20

___

### proposal\_id

• **proposal\_id**: `number`

#### Defined in

wasm/lib/proto/proposal_fee.ts:19

___

### treasury

• **treasury**: `string`

#### Defined in

wasm/lib/proto/proposal_fee.ts:18


<a name="interfacesproposal_paymd"></a>

# Interface: proposal\_pay

Related to create_proposal_operation.
Generated during block processing during proposal maintenance in batches
for each proposal that is chosen and receives funding.

**`Param`**

id of chosen proposal

**`Param`**

account designated to receive funding (receiver of payment)

**`Param`**

treasury account, source of payment

**`Param`**

(HBD) paid amount

## Properties

### payer

• **payer**: `string`

#### Defined in

wasm/lib/proto/proposal_pay.ts:20

___

### payment

• **payment**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/proposal_pay.ts:21

___

### proposal\_id

• **proposal\_id**: `number`

#### Defined in

wasm/lib/proto/proposal_pay.ts:18

___

### receiver

• **receiver**: `string`

#### Defined in

wasm/lib/proto/proposal_pay.ts:19


<a name="interfacesproxy_clearedmd"></a>

# Interface: proxy\_cleared

There are 4 cases( 4 operations ) that can generate `proxy_cleared_operation` virtual operation:

`account_witness_proxy_operation`:
A vop `proxy_cleared_operation` is created in the same block.
We want to set a proxy, but an old proxy exists:
1) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}
We don't want to set a proxy:
2) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}

`decline_voting_rights_operation`:
A vop `proxy_cleared_operation` is generated automatically after `HIVE_OWNER_AUTH_RECOVERY_PERIOD` time ( 30 days ).
3) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}

`update_proposal_votes_operation`, `account_witness_proxy_operation`, `account_witness_vote_operation`:
After HF25 a vop `proxy_cleared_operation` is generated automatically after `HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD` time ( 365 days ).
4) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}

**`Param`**

user that sets/unsets a proxy

**`Param`**

proxy user that facilitates voting on witnesses

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/proxy_cleared.ts:28

___

### proxy

• **proxy**: `string`

#### Defined in

wasm/lib/proto/proxy_cleared.ts:29


<a name="interfacesrecover_accountmd"></a>

# Interface: recover\_account

This operation is part of the recovery account process (more information in request_account_recovery).
After creating by recovery account the operation request_account_recovery,
the user has HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD hours to respond using
operation recover_account_operation and set a new owner authority.
The operation recover_account_operation has to be signed using the two owner authorities,
the old one (maybe compromised) and the new one (see request_account_recovery).
There must be at least 60 minutes (HIVE_OWNER_UPDATE_LIMIT) between executions of operation recover_account_operation.

**`Param`**

The account to be recovered.

**`Param`**

The new owner authority as specified in the request account recovery operation.

**`Param`**

A previous owner's authority, may be compromised.
                                            If the operation change_recovery_account_operation was generated,
                                            it has not been yet 30 days since its creation.

**`Param`**

Not currently used.

## Properties

### account\_to\_recover

• **account\_to\_recover**: `string`

#### Defined in

wasm/lib/proto/recover_account.ts:25

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/recover_account.ts:28

___

### new\_owner\_authority

• **new\_owner\_authority**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/recover_account.ts:26

___

### recent\_owner\_authority

• **recent\_owner\_authority**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/recover_account.ts:27


<a name="interfacesrecurrent_transfermd"></a>

# Interface: recurrent\_transfer

Creates/updates/removes a recurrent transfer in the currency Hive or HBD.
Since HF 28, if user has more than one recurrent transfer to the same receiver
or if user creates the recurrent transfer using pair_id in the extensions,
user has to specify the pair_id in order to update or remove the defined recurrent transfer.
- If amount is set to 0, the recurrent transfer will be deleted and the virtual operation
  fill_recurrent_transfer_operation is not generated
- If there is already a recurrent transfer matching 'from' and 'to', the recurrent transfer will be replaced, but:
- If the 'recurrence' is not changed, the next execution will be according to “old definition”
- If the 'recurrence' is changed, then the next execution will be “update date” + 'recurrence' there is no execution on the update date.
- Up to HF28 there can be only one recurrent transfer for sender 'from' and receiver 'to'.
  Since H28 users may define more recurrent transfers to the same sender and receiver using pair_id in the 'executions'.
- The one account may define up to 255 recurrent transfers to other accounts.
- The execution date of the last transfer should be no more than 730 days in the future.

**`Param`**

**`Param`**

Account to transfer asset to. Cannot set a transfer to yourself.

**`Param`**

The amount of asset to transfer from

**`Ref`**

from to

**`Ref`**

to.
                        If the recurrent transfer failed 10 (HIVE_MAX_CONSECUTIVE_RECURRENT_TRANSFER_FAILURES)
                        times because of the lack of funds, the recurrent transfer will be deleted.
                        Allowed currency: Hive and HBD.

**`Param`**

must be shorter than 2048.

**`Param`**

How often will the payment be triggered, unit: hours.
                             The first transfer is executed immediately.
                             The minimum value of the parameter is 24 h.

**`Param`**

How many times the recurrent payment will be executed.
                             Executions must be at least 2, if you set executions to 1 the recurrent transfer will not be executed.

**`Param`**

Extensions. Since HF 28 it may contain the 'pair_id'.
                                                   It allows to define more than one recurrent transfer from sender to the same receiver 'to'.
                                                   Default value 'pair_id=0'.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:51

___

### executions

• **executions**: `number`

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:54

___

### extensions

• **extensions**: `recurrent_transfer_extension`[]

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:55

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:49

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:52

___

### recurrence

• **recurrence**: `number`

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:53

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/recurrent_transfer.ts:50


<a name="interfacesremove_proposalmd"></a>

# Interface: remove\_proposal

Using operation remove_proposal_operation, a user may remove proposals specified by given IDs.

**`Param`**

**`Param`**

**`Param`**

## Properties

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/remove_proposal.ts:18

___

### proposal\_ids

• **proposal\_ids**: `string`[]

#### Defined in

wasm/lib/proto/remove_proposal.ts:17

___

### proposal\_owner

• **proposal\_owner**: `string`

#### Defined in

wasm/lib/proto/remove_proposal.ts:16


<a name="interfacesrequest_account_recoverymd"></a>

# Interface: request\_account\_recovery

In case of the compromised owner authority, a user may recover it.
There are two conditions that have to be fulfilled to do it:
1. A user should have an actual recovery account.
   During an account creation, the account that created a new account is set as a recovery
   account by default, but it can be changed by the user (using operation change_recovery_account_operation).
   If the account was created by account temp, then a recovery account is empty and
   it is set as a top witness – it is not good a recovery account.
   Note: it takes HIVE_OWNER_AUTH_RECOVERY_PERIOD (30 days) after sending change_recovery_account_operation.
   for the new recovery agent to become active. During that period the previous agent remains active for the account.
2. The compromised owner authority is still recent.
   Owner authority is considered recent and remains valid for the purpose of account recovery
   for HIVE_OWNER_AUTH_RECOVERY_PERIOD (30 days) after it was changed.

   Note: look for account_update_operation or account_update2_operation in account history to see when its
   owner authority was compromised.

The recovery account process.
Conditions:
1. An account { account_to_recover } has an actual recovery account.
2. An account { account_to_recover } realizes that someone may have access to its owner key and it is less
   than 30 days from generating an operation: change_recovery_account_operation.
Steps:
A user { account_to_recover } asks his recovery account { recovery_account } to create a request account recovery (outside the blockchain).
A recovery account { recovery_account } creates an operation:  request_account_recovery_operation with {new_owner_authority}.
A user { account_to_recover } creates an operation: recover_account_operation using { new_owner_authority} and
{recent_owner_authority} and signing with two signatures (the old one and the new one).
A user has HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD to generate this operation.

In order to cancel a request, a user should create a new request with weight of authority =0.
The operation: request_account_recovery is valid HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD hours and
if after HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD  hours there is no response (operation: recover_account_operation) it is expired.

**`Param`**

The account that may create a request for account recovery.
                                   It is important to keep it actual.

**`Param`**

The account to be recovered.

**`Param`**

The new owner authority – the public, not private key.
                                         The new authority should be satisfiable.

**`Param`**

Not currently used.

## Properties

### account\_to\_recover

• **account\_to\_recover**: `string`

#### Defined in

wasm/lib/proto/request_account_recovery.ts:50

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/request_account_recovery.ts:52

___

### new\_owner\_authority

• **new\_owner\_authority**: `undefined` \| [`authority`](#authority)

#### Defined in

wasm/lib/proto/request_account_recovery.ts:51

___

### recovery\_account

• **recovery\_account**: `string`

#### Defined in

wasm/lib/proto/request_account_recovery.ts:49


<a name="interfacesreturn_vesting_delegationmd"></a>

# Interface: return\_vesting\_delegation

Related to delegate_vesting_shares_operation.
Generated during block processing when process of returning removed or lowered vesting delegation is finished (after return period
passed) and delegator received back his vests.

**`Param`**

delegator (receiver of vesting_shares)

**`Param`**

(VESTS) returned delegation

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/return_vesting_delegation.ts:16

___

### vesting\_shares

• **vesting\_shares**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/return_vesting_delegation.ts:17


<a name="interfacesset_withdraw_vesting_routemd"></a>

# Interface: set\_withdraw\_vesting\_route

The operation set_withdraw_vesting_route_operation allows a user to decide where
and how much percent of hive should be transferred to  the account { to_account }
from power down operation. A user may also decide that the Hive may be immediately converted to Hive Power.
The operation may be created in any moment of power down operation and even if there is no power down operation in progress.
The setting is valid till a user creates an operation  set_withdraw_vesting_route_operation
with the same { to_account} and with the {percent} = 0.
A user may set up 10 { to_account } accounts.

**`Param`**

The account the funds are coming from.

**`Param`**

The account the funds are going to. A user may set up 10 accounts.

**`Param`**

The percentage of the HP shares.
                          If the sum of the setting shares is less than 100%,
                          the rest is transferred to the liquid balance of { from_account }.
                          Default value: percent = 0;

**`Param`**

If auto_vest = true, then the amount of the Hive is immediately converted
                          into HP on the { to_account } balance.
                          If auto_vest = false, there is no conversion from Hive into HP.
                          Default auto_vest = false;

## Properties

### auto\_vest

• **auto\_vest**: `boolean`

#### Defined in

wasm/lib/proto/set_withdraw_vesting_route.ts:30

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/set_withdraw_vesting_route.ts:27

___

### percent

• **percent**: `number`

#### Defined in

wasm/lib/proto/set_withdraw_vesting_route.ts:29

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/set_withdraw_vesting_route.ts:28


<a name="interfacesshutdown_witnessmd"></a>

# Interface: shutdown\_witness

Related to block processing.
Generated during block processing when witness is removed from active witnesses after it was detected he have missed
all blocks scheduled for him for last day. No longer active after HF20.

**`See`**

producer_missed_operation

**`Param`**

witness that was shut down

## Properties

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/shutdown_witness.ts:15


<a name="interfacessystem_warningmd"></a>

# Interface: system\_warning

Related to block processing or selected operations.
Generated every time something occurs that would normally be only visible to node operators in their logs
but might be interesting to general HIVE community. Such vops can be observed on account history of 'initminer'.
Currently the following generate system warnings:
 - unknown type of witness during block processing [should probably be FC_ASSERT]
   indicates some problem in the code
 - shortfall of collateral during finalization of HIVE->HBD conversion (@see fill_collateralized_convert_request_operation)
   the community covers the difference in form of tiny amount of extra inflation
 - artificial correction of internal price of HIVE due to hitting of HBD hard cap limit
   every operation that involves conversion from HBD to HIVE will give output amount that is smaller than real world value
 - noncanonical fee symbol used by witness [should disappear if it never happened as suggested by TODO message]
 - witnesses changed maximum block size

**`Param`**

warning message

## Properties

### message

• **message**: `string`

#### Defined in

wasm/lib/proto/system_warning.ts:23


<a name="interfacestransactionmd"></a>

# Interface: transaction

## Properties

### expiration

• **expiration**: `string`

#### Defined in

wasm/lib/proto/transaction.ts:11

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/transaction.ts:13

___

### operations

• **operations**: [`operation`](#operation)[]

#### Defined in

wasm/lib/proto/transaction.ts:12

___

### ref\_block\_num

• **ref\_block\_num**: `number`

#### Defined in

wasm/lib/proto/transaction.ts:9

___

### ref\_block\_prefix

• **ref\_block\_prefix**: `number`

#### Defined in

wasm/lib/proto/transaction.ts:10

___

### signatures

• **signatures**: `string`[]

for signed_transaction

#### Defined in

wasm/lib/proto/transaction.ts:15


<a name="interfacestransfermd"></a>

# Interface: transfer

**`Brief`**

Transfers any liquid asset (nonvesting) from one account to another.

Transfer funds from 'from_account' to 'to_account'. HIVE and HBD can be transferred.
Memo for the transaction can be encrypted if message is started with '#'.
Private Memo Key must already be in the wallet for encrypted memo to work.

**`Param`**

The account the funds are coming from.

**`Param`**

The account the funds are going to.

**`Param`**

The amount of asset to transfer from

**`Ref`**

from_account to

**`Ref`**

to_account, the allowed currency: HIVE and HBD.

**`Param`**

The memo is plain-text, any encryption on the memo is up to a higher level protocol, must be shorter than 2048.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/transfer.ts:22

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/transfer.ts:20

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/transfer.ts:23

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/transfer.ts:21


<a name="interfacestransfer_from_savingsmd"></a>

# Interface: transfer\_from\_savings

Funds withdrawals from the savings to an account take three days.

**`Param`**

Account name.

**`Param`**

The number is given by a user. Should be unique for a user.

**`Param`**

Account name.

**`Param`**

The allowed currency: HIVE and HBD, amount > 0.

**`Param`**

Have to be UTF8,  must be shorter than 2048.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/transfer_from_savings.ts:20

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_from_savings.ts:17

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/transfer_from_savings.ts:21

___

### request\_id

• **request\_id**: `number`

#### Defined in

wasm/lib/proto/transfer_from_savings.ts:18

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_from_savings.ts:19


<a name="interfacestransfer_to_savingsmd"></a>

# Interface: transfer\_to\_savings

A user can place Hive and Hive Dollars into savings balances.
Funds can be withdrawn from these balances after a three day delay.
Keeping funds on the savings balance mitigates loss from hacked and compromised accounts.
The maximum amount a user can lose instantaneously is the sum of what they hold in liquid balances.
Assuming an account can be recovered quickly, loss in such situations can be kept to a minimum
Additionally for keeping Hive Dollars on the savings balance, the interests are calculated.

**`Param`**

The account the funds are coming from.

**`Param`**

The account the funds are going to.
                             The funds may be transferred to someone else savings balance.

**`Param`**

The allowed currency: HIVE and HBD, amount > 0.

**`Param`**

Have to be UTF8, must be shorter than 2048.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/transfer_to_savings.ts:24

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_to_savings.ts:22

___

### memo

• **memo**: `string`

#### Defined in

wasm/lib/proto/transfer_to_savings.ts:25

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_to_savings.ts:23


<a name="interfacestransfer_to_vestingmd"></a>

# Interface: transfer\_to\_vesting

The operation is also called Staking.
This operation converts Hive into Hive Power (also called Vesting Fund Shares  or VESTS) at the current exchange rate.
The conversion may be done between the same account or to another account.
The more HP (Hive Power) the account has, the more:
a.       Governance voting power (for witnesses and proposals) has
b.       Social voting power has (indirectly affects Increase curation rewards)
c.       Resource Credit has

**`Param`**

The account the funds are coming from.

**`Param`**

The account the funds are going to. If null, then the same as 'from_account'.

**`Param`**

Must be HIVE, amount > 0.

## Properties

### amount

• **amount**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/transfer_to_vesting.ts:23

___

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_to_vesting.ts:21

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_to_vesting.ts:22


<a name="interfacestransfer_to_vesting_completedmd"></a>

# Interface: transfer\_to\_vesting\_completed

Related to transfer_to_vesting_operation.
Generated every time above operation is executed. Supplements it with amount of VESTS received.
Note: power up immediately increases mana regeneration and vote power for comments, but there is a grace period before
it activates as governance vote power.

**`See`**

delayed_voting

**`Param`**

account that executed power up (source of hive_vested)

**`Param`**

account that gets power up (receiver of vesting_shares_received)

**`Param`**

(HIVE) liquid funds being turned into VESTS

**`Param`**

(VESTS) result of power up

## Properties

### from\_account

• **from\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_to_vesting_completed.ts:20

___

### hive\_vested

• **hive\_vested**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/transfer_to_vesting_completed.ts:22

___

### to\_account

• **to\_account**: `string`

#### Defined in

wasm/lib/proto/transfer_to_vesting_completed.ts:21

___

### vesting\_shares\_received

• **vesting\_shares\_received**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/transfer_to_vesting_completed.ts:23


<a name="interfacesupdate_proposalmd"></a>

# Interface: update\_proposal

A user who created the proposal may update it. A user may decrease {daily_pay},
change subject, permlink and {end_date} (using {extensions}).
In order to update the proposal parameters, all parameters should be entered.

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

**`Param`**

## Properties

### creator

• **creator**: `string`

#### Defined in

wasm/lib/proto/update_proposal.ts:32

___

### daily\_pay

• **daily\_pay**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/update_proposal.ts:33

___

### extensions

• **extensions**: `update_proposal_extension`[]

#### Defined in

wasm/lib/proto/update_proposal.ts:36

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/update_proposal.ts:35

___

### proposal\_id

• **proposal\_id**: `string`

#### Defined in

wasm/lib/proto/update_proposal.ts:31

___

### subject

• **subject**: `string`

#### Defined in

wasm/lib/proto/update_proposal.ts:34


<a name="interfacesupdate_proposal_votesmd"></a>

# Interface: update\_proposal\_votes

A user may vote for proposals directly using an operation: update_proposal_votes_operation,
or indirectly using the proxy - operation:  account_witness_proxy_operation.
A user may vote for proposals submitted by the other users.
By voting for the proposal, a user may select which proposals should be funded.
A user may vote for as many proposals as they wants, but you cannot vote twice for the same proposal.
If a proxy is specified then all existing votes are deactivated. When the proxy is removed, the votes will be activated.
Your vote power depends on your HP.
If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation
is not executed in HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
expired_account_notification_operation is generated.

**`Param`**

Account name.

**`Param`**

IDs of proposals to vote for/against. Nonexisting IDs are ignored.

**`Param`**

To vote for the proposal, the approve = true.
                        To remove the vote, the approve = false.

**`Param`**

## Properties

### approve

• **approve**: `boolean`

#### Defined in

wasm/lib/proto/update_proposal_votes.ts:29

___

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/update_proposal_votes.ts:30

___

### proposal\_ids

• **proposal\_ids**: `string`[]

#### Defined in

wasm/lib/proto/update_proposal_votes.ts:28

___

### voter

• **voter**: `string`

#### Defined in

wasm/lib/proto/update_proposal_votes.ts:27


<a name="interfacesvesting_shares_splitmd"></a>

# Interface: vesting\_shares\_split

Related to hardfork 1.
Generated for every account with nonzero vesting balance.
Note: due to too small precision of VESTS asset it was increased by 6 digits, meaning all underlying
amounts had to be multiplied by million.

**`Param`**

affected account (source of vesting_shares_before_split and receiver of vesting_shares_after_split)

**`Param`**

(VESTS) balance before split

**`Param`**

(VESTS) balance after split

## Properties

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/vesting_shares_split.ts:18

___

### vesting\_shares\_after\_split

• **vesting\_shares\_after\_split**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/vesting_shares_split.ts:20

___

### vesting\_shares\_before\_split

• **vesting\_shares\_before\_split**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/vesting_shares_split.ts:19


<a name="interfacesvotemd"></a>

# Interface: vote

A user may upvote or downvote a post or a comment.

A user has a voting power. The max voting power depends on HP.

There are two manabars related to voting: Voting manabar and Downvoting manabar.
Voting and downvoting manabars are defined as a percentage of total vote weight.
Downvote manabar has 25% of the vote power weight and vote manabar has 100% of the vote power weight,
but a user downvote with the total vote weight (not 25 %, but 100%).

When a user casts a vote, 1/50th of the remaining mana is used for a 100% vote.
The voting powers regenerate from 0 to 100% in 5 days (20% per day).

If a voter casts another vote for the same post or comment before rewards are paid,
it counts as vote edit. Vote edit cancels all effects of previous vote and acts as completely new vote,
except mana used for previous vote is not returned.

The author of the post or the comment may receive the reward,
the amount of the author's reward depends on the numbers and powers of the votes.
By default the author reward is paid 50% HP and 50 % HBD.

A user who votes for the post or the comment may receive the curation reward. It is paid 100% HP. Its share depends on:
- voting power
- weight of the vote – a user may decide about the weight of the vote
- the time when they vote – the sooner you vote, the higher the share in the curation reward (the first 24 h
  the weight of the vote is 100% - early voting, next 48 hours the weight is divided by 2, then – till the 7th day - it is divided by 8)

When a post or a comment receives a reward, it is divided between the author's reward and the curation reward.
The curation reward is shared among curators.

The calculated reward should be more than 0.02 HBD to be paid, if it is less, it is not paid.

A downvoting user doesn’t receive the curation reward.
Downvoting may affect the author of the comment's reputation when a user who downvotes has a higher reputation than the author.

**`Param`**

Account name.

**`Param`**

Account name, the author of the post or the comment.

**`Param`**

The identifier of the post or comment.

**`Param`**

It defines how many percent of the non-used voting power a user wants to use.
                         Allowed values from -10000 (-100%) to 10000 (100%).
                         Downvotes: from -10000 (-100%) to 0.
                         Upvotes: from 0 to 10000 (100%).

## Properties

### author

• **author**: `string`

#### Defined in

wasm/lib/proto/vote.ts:51

___

### permlink

• **permlink**: `string`

#### Defined in

wasm/lib/proto/vote.ts:52

___

### voter

• **voter**: `string`

#### Defined in

wasm/lib/proto/vote.ts:50

___

### weight

• **weight**: `number`

#### Defined in

wasm/lib/proto/vote.ts:53


<a name="interfaceswithdraw_vestingmd"></a>

# Interface: withdraw\_vesting

This operation converts Hive Power (also called Vesting Fund Shares or VESTS) into HIVE.
At any given point in time an account can be withdrawing from their vesting shares.
A user may change the number of shares they wish to cash out at any time between 0 and their total vesting stake.
After applying this operation, vesting_shares will be withdrawn at a rate of vesting_shares/13 per week for 13 weeks
starting one week after this operation is included in the blockchain.
This operation is not valid if a user has no vesting shares.
There can be only one withdraw_vesting_operation  processed at the same time.
If a user wants to stop withdraw_vesting_operation, they should create an operation withdraw_vesting_operation with amount =0.
If a user creates a new withdraw_vesting_operation when the old one is still processed,
then the old withdraw_vesting_operation will be canceled and a new one will be processed.

**`Param`**

The account the funds are coming from.

**`Param`**

Amount of VESTS (HP)

## Properties

### account

• **account**: `string`

#### Defined in

wasm/lib/proto/withdraw_vesting.ts:23

___

### vesting\_shares

• **vesting\_shares**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/withdraw_vesting.ts:24


<a name="interfaceswitness_block_approvemd"></a>

# Interface: witness\_block\_approve

This is an operation for witnesses.
This operation is used in the process of block_validity_vote
(see https://hive.blog/hive-139531/@blocktrades/one-block-irreversibility-for-delegated-proof-of-stake-dpos).

**`Param`**

**`Param`**

## Properties

### block\_id

• **block\_id**: `string`

#### Defined in

wasm/lib/proto/witness_block_approve.ts:16

___

### witness

• **witness**: `string`

#### Defined in

wasm/lib/proto/witness_block_approve.ts:15


<a name="interfaceswitness_set_propertiesmd"></a>

# Interface: witness\_set\_properties

This is an operation for witnesses.
This is one of the two operations allowing to update witness properties (@see witness_update_operation).
The whole list of properties is available here:
https://gitlab.syncad.com/hive/hive/-/blob/master/doc/witness_parameters.md.

**`Param`**

Witness account name.

**`Param`**

There are the following properties available in the {props}:
                                     account_creation_fee, account_subsidy_budget, account_subsidy_decay,
                                     maximum_block_size, hbd_interest_rate. hbd_exchange_rate, url and new_signing_key.

**`Param`**

## Properties

### extensions

• **extensions**: [`future_extensions`](#future_extensions)[]

#### Defined in

wasm/lib/proto/witness_set_properties.ts:22

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/witness_set_properties.ts:20

___

### props

• **props**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

wasm/lib/proto/witness_set_properties.ts:21


<a name="interfaceswitness_updatemd"></a>

# Interface: witness\_update

The operation witness_update_operation may be used to become a new witness or to update witness properties.
There are two operations that allow to update witness properties witness_update_operation and witness_set_properties_operation.
In order to update witness properties it is recommended to use witness_set_properties_operation.

If a user wants to become a witness, the operation witness_update_operation should be created.
If the witness doesn’t want to be a witness any more, the operation witness_update_operation with empty { block_signing_key }
should be created.

**`Param`**

The witness who wants to update properties or a user who wants to become a witness.

**`Param`**

url to information about witness.

**`Param`**

Public block signing key.

**`Param`**

**`Param`**

The asset is validated (the format should be correct and should be expressed in Hive),
                     but the fee is currently ignored.

## Properties

### block\_signing\_key

• **block\_signing\_key**: `string`

#### Defined in

wasm/lib/proto/witness_update.ts:27

___

### fee

• **fee**: `undefined` \| [`asset`](#asset)

#### Defined in

wasm/lib/proto/witness_update.ts:29

___

### owner

• **owner**: `string`

#### Defined in

wasm/lib/proto/witness_update.ts:25

___

### props

• **props**: `undefined` \| [`legacy_chain_properties`](#legacy_chain_properties)

#### Defined in

wasm/lib/proto/witness_update.ts:28

___

### url

• **url**: `string`

#### Defined in

wasm/lib/proto/witness_update.ts:26
