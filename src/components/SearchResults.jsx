function SearchResults({ results }) {
  return (
    <div className="queryDiv">
      {results?.map((tweet) => {
        return (
          <article className="tweetCard" key={tweet.id}>
            <div className="tweetAvatar">
              {tweet.name?.charAt(0).toUpperCase()}
            </div>
            <div className="tweetContent">
              <div className="tweetHeader">
                <p className="tweetName">
                  {tweet.name}
                  <span className="tweetUsername">
                    @{tweet.name?.toLowerCase().replace(/\s+/g, "")}
                  </span>
                </p>
                <p>{tweet.registeredOn}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default SearchResults;
