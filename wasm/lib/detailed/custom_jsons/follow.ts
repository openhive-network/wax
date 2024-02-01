import { HiveAppsOperationsBuilder, TAccountName } from './builder.js';
import { WaxError } from '../../errors.js';

export enum EFollowBlogAction {
  FOLLOW_BLOG = 0b0001,
  MUTE_BLOG   = 0b0010,
  BOTH        = FOLLOW_BLOG | MUTE_BLOG
};

export class FollowOperationBuilder extends HiveAppsOperationsBuilder<FollowOperationBuilder> {
  protected readonly id = "follow";

  /**
   * Allows to generate operation to follow specified list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                Also it will be the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be muted working_account
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public followBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    const following = otherBlogs.length > 0 ? [ blog, ...otherBlogs ] : blog;

    this.body = [
      this.id,
      {
        follower: workingAccount,
        following,
        what: [ "blog" ]
      }
    ];

    return this;
  }

  /**
   * Allows to generate operation to mute given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be muted working_account
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list

   *
   * @returns {FollowOperationBuilder} itself
   */
  public muteBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    const following = otherBlogs.length > 0 ? [ blog, ...otherBlogs ] : blog;

    this.body = [
      this.id,
      {
        follower: workingAccount,
        following,
        what: [ "ignore" ]
      }
    ];

    return this;
  }

  /**
   * Allows to push operation to remove all matching entries between workingAccount (follower) and specified following blog accounts.
   * Scope of clear operation can be specfied by action parameter to point only blog, mute or both entries.
   *
   * @param {EFollowBlogAction} action determines scope of entries removal
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/otherBlogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be muted working_account
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   */
  public resetBlogList(action: EFollowBlogAction, workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    const following = otherBlogs.length > 0 ? [ blog, ...otherBlogs ] : blog;

    let strAction: string;

    switch(action) {
      case EFollowBlogAction.FOLLOW_BLOG:
        strAction = "reset_following_list";
        break;
      case EFollowBlogAction.MUTE_BLOG:
        strAction = "reset_muted_list";
        break;
      case EFollowBlogAction.BOTH:
        strAction = "reset_all_lists";
        break;
      default:
        throw new WaxError(`Unknown action to reset blog list: ${action}`);
    }

    this.body = [
      this.id,
      {
        follower: workingAccount,
        following,
        what: [ strAction ]
      }
    ];

    return this;
  }

  /**
   * Allows to generate operation to reblog specified post.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                Also it will be the account which reblogs given post (aka account)
   * @param {TAccountName} author account name of the author of the given post
   * @param {string} permlink permlink of the given post
   *
   * @returns {FollowOperationBuilder} itself
   */
  public reblog(workingAccount: TAccountName, author: TAccountName, permlink: string): FollowOperationBuilder {
    this.body = [
      "reblog",
      {
        account: workingAccount,
        author,
        permlink
      }
    ];

    return this;
  }
}
