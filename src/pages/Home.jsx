import TweetForm from "../components/TweetForm"
import Tweets from "../components/Tweets"


function Home() {
  return (
    <section>
      <TweetForm label={"tweets"} />
      <Tweets />
    </section>
  )
}

export default Home