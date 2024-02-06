import { HiveAppsOperationsBuilder, TAccountName } from './builder.js';
import { WaxError } from '../../errors.js';

export enum EFollowBlogAction {
  FOLLOW_BLOG = 0b000001,
  MUTE_BLOG   = 0b000010,
  BOTH        = FOLLOW_BLOG | MUTE_BLOG
};

const followKeys = Object.keys(EFollowBlogAction) as Array<keyof typeof EFollowBlogAction>;

export class FollowOperationBuilder extends HiveAppsOperationsBuilder<FollowOperationBuilder> {
  protected readonly id = "follow";

  private followBodyBuilder(what: string, workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    const following = otherBlogs.length > 0 ? [ blog, ...otherBlogs ] : blog;

    if(Array.isArray(following) && following.length > 100)
      throw new WaxError('Too long following list. Accepted max length: 100');

    this.body = [
      this.id,
      {
        follower: workingAccount,
        following,
        what: [ what ]
      }
    ];

    return this;
  }

  /**
   * Allows to generate operation to follow specified list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                Also it will be the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be followed
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public followBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("blog", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Unfollows / unmutes given blog
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                Also it will be the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be unfollowed
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public unfollowBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to mute given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be muted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public muteBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("ignore", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Unfollows / unmutes given blog
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be unmuted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public unmuteBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.unfollowBlog(workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to reset blacklist list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to reset the blacklist list
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public resetBlacklistBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("reset_blacklist", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to blacklist given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be blacklisted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public blacklistBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("blacklist", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to reset follow blacklist list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to reset the follow blacklist list
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public resetFollowBlacklistBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("reset_follow_blacklist", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to follow blacklist of given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to follow blacklisted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public followBlacklistBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("follow_blacklist", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to unblacklist given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be unblacklisted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public unblacklistBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("unblacklist", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to unfollow blacklist of given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to unfollow blacklisted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public unfollowBlacklistBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("unfollow_blacklist", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to reset follow blacklist list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to reset the follow blacklist list
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public resetFollowMutedBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("reset_follow_muted_list", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to follow muted of given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to follow muted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public followMutedBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("follow_muted", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to unfollow muted of given list of blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to unfollow muted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public unfollowMutedBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("unfollow_muted", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to generate operation to reset all lists of given blog accounts.
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/other_blogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to reset the lists
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   *
   * @returns {FollowOperationBuilder} itself
   */
  public resetAllBlog(workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    return this.followBodyBuilder("reset_all_lists", workingAccount, blog, ...otherBlogs);
  }

  /**
   * Allows to push operation to remove all matching entries between workingAccount (follower) and specified following blog accounts.
   * Scope of clear operation can be specfied by action parameter to point only blog, mute or both entries.
   *
   * @param {EFollowBlogAction} action determines scope of entries removal
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                This is the account which follows the ones specified by the blog/otherBlogs parameters (aka follower)
   * @param {TAccountName} blog the blog account to be muted
   * @param {TAccountName[]} otherBlogs optional list of other blog accounts to be concatenated and build single list
   */
  public resetBlogList(action: EFollowBlogAction | number, workingAccount: TAccountName, blog: TAccountName, ...otherBlogs: TAccountName[]): FollowOperationBuilder {
    const following = otherBlogs.length > 0 ? [ blog, ...otherBlogs ] : blog;

    const actions: string[] = [];

    for(let i = followKeys.length / 2; i < followKeys.length; ++i)
      if(action & EFollowBlogAction[followKeys[i]]) {
        switch(followKeys[i]) {
          case "FOLLOW_BLOG":
            actions.push("reset_following_list");
            break;
          case "MUTE_BLOG":
            actions.push("reset_muted_list");
            break;
          default:
            throw new WaxError(`Unknown action to reset blog list: ${action}`);
        }
      }

    this.body = [
      this.id,
      {
        follower: workingAccount,
        following,
        what: actions
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
