import { BiRepost } from "react-icons/bi";
import useUser from "../hooks/useUser";
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { AiOutlineShareAlt } from "react-icons/ai";
import { MdOutlineReply } from "react-icons/md";

function TweetCard({tweets,isLoading,error,handleFollow,handleLikeTweet,handleRepost}) {
    const{loggedUser}=useUser()
  return (
    <div className="tweetsContainer">
      {isLoading && <p className="tweetStatus">Loading tweets...</p>}
      {error && <p className="tweetError">{error}</p>}

      {!isLoading &&
        !error &&
        tweets?.map((tweet) => {
          const alreadyLiked = tweet.likedBy?.includes(loggedUser.id);
          const alreadyReweeted = tweet.retweetedBy?.includes(loggedUser.id);
          const alreadyFollowing = loggedUser?.following?.includes(tweet.userId);
          const isOnwTweet = loggedUser?.id === tweet.userId;
          return (
            <article className="tweetCard" key={tweet.id}>
              <div className="tweetAvatar">
                {tweet.name?.charAt(0).toUpperCase()}
              </div>

              <div className="tweetContent">
                <div className="tweetHeader">
                  <p className="tweetName">{tweet.name}</p>
                  <span className="tweetUsername">
                    @{tweet.name?.toLowerCase().replace(/\s+/g, "")}
                  </span>
                  <span className="tweetDot">·</span>
                  <time className="tweetTime">
                    {tweet.postedOn
                      ? tweet.postedOn.toDate().toLocaleDateString()
                      : ""}
                  </time>
                  <div className="follow">
                    {!isOnwTweet && (
                      <button
                        className="followBtn"
                        onClick={() =>
                          handleFollow(tweet.userId, alreadyFollowing)
                        }
                      >
                        {alreadyFollowing ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>

                <p className="tweetText">{tweet.tweet}</p>

                <div className="tweetActions">
                  <button type="button" aria-label="Reply">
                    <span>
                      <MdOutlineReply />
                    </span>
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => handleRepost(tweet.id, alreadyReweeted)}
                  >
                    {tweet.retweetedBy?.includes(loggedUser.id) ? (
                      <BiRepost className="rtBtn" />
                    ) : (
                      <BiRepost />
                    )}{" "}
                    {tweet.retweets}
                  </button>

                  <button
                    onClick={() => handleLikeTweet(tweet.id, alreadyLiked)}
                  >
                    {tweet.likedBy?.includes(loggedUser.id) ? (
                      <FcLike />
                    ) : (
                      <CiHeart />
                    )}{" "}
                    {tweet.likes}
                  </button>

                  <button type="button" aria-label="Share">
                    <span>
                      <AiOutlineShareAlt />
                    </span>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}

export default TweetCard;
