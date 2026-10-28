import { arrayRemove, arrayUnion, doc, increment, updateDoc, writeBatch } from "firebase/firestore"
import toast from "react-hot-toast"
import { db } from "../../firebase"
import useUser from "./useUser"

function useTweetActions() {
  const { loggedUser } = useUser()

  async function handleLikeTweet(tweetId, alreadyLiked) {
    if (!loggedUser?.id) return

    try {
      await updateDoc(doc(db, "tweets", tweetId), {
        likedBy: alreadyLiked ? arrayRemove(loggedUser.id) : arrayUnion(loggedUser.id),
        likes: increment(alreadyLiked ? -1 : 1)
      })
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleRepost(tweetId, alreadyReposted) {
    if (!loggedUser?.id) return

    try {
      await updateDoc(doc(db, "tweets", tweetId), {
        retweetedBy: alreadyReposted ? arrayRemove(loggedUser.id) : arrayUnion(loggedUser.id),
        retweets: increment(alreadyReposted ? -1 : 1)
      })
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleFollow(creatorId, alreadyFollowing) {
    if (!loggedUser?.id || creatorId === loggedUser.id) return

    try {
      const batch = writeBatch(db)

      batch.update(doc(db, "users", loggedUser.id), {
        following: alreadyFollowing ? arrayRemove(creatorId) : arrayUnion(creatorId),
        followingCount: increment(alreadyFollowing ? -1 : 1)
      })

      batch.update(doc(db, "users", creatorId), {
        followers: alreadyFollowing ? arrayRemove(loggedUser.id) : arrayUnion(loggedUser.id),
        followersCount: increment(alreadyFollowing ? -1 : 1)
      })

      await batch.commit()
    } catch (error) {
      toast.error(error.message || (alreadyFollowing ? "Failed to unfollow" : "Failed to follow"))
    }
  }

  return { handleFollow, handleLikeTweet, handleRepost }
}

export default useTweetActions
