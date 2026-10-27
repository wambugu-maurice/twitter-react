import { useState } from "react"
import { useParams } from "react-router-dom"
import { auth, db } from "../../firebase"
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore"
import toast from "react-hot-toast"
import { Button, Textarea } from "@chakra-ui/react"


function TweetForm({ label }) {
  const [tweet, setTweet] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { tweetId } = useParams()

  async function handleTweet(e) {
    e.preventDefault()
    setError("")

    const user = auth.currentUser
    if (!user) {
      const message = "You must be signed in to post."
      setError(message)
      toast.error(message)
      return
    }

    setIsLoading(true)
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const name = userDoc.data()?.name || user.displayName || user.email

      if (!name) {
        throw new Error("Your profile name could not be found.")
      }

      const newTweet = {
        tweet,
        name,
        userId: user.uid,
        postedOn: serverTimestamp(),
        tweetId: label === "comment" ? tweetId ?? null : null,
        likes:0,
        comments: 0
      }

      await addDoc(collection(db, "tweets"), newTweet)
      toast.success(`${label} posted`)
      setTweet("")
    } catch (err) {
      setError(err.message)
      toast.error(`failed to post ${label}`)
      console.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="tweetDiv">
      {error && <p>{error}</p>}
      <form onSubmit={handleTweet}>
        <Textarea
          placeholder="what's happening?"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          name="tweets"
          resize="none"
          border={"1px solid black"}
          width={"90%"}
        />
        <Button margin={"10px"} type="submit" colorScheme="green" isDisabled={isLoading || tweet.length < 2}>
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </form>
    </section>
  )
}

export default TweetForm