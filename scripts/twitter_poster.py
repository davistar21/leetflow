import os
import sys
import tweepy
import progress_tracker
from dotenv import load_dotenv

load_dotenv()

def post_tweet(text, reply_to_id=None):
    """
    Posts a tweet using Tweepy Client (API v2).
    """
    # Load credentials
    api_key = os.getenv("TWITTER_API_KEY")
    api_secret = os.getenv("TWITTER_API_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
    bearer_token = os.getenv("TWITTER_BEARER_TOKEN")

    if not all([api_key, api_secret, access_token, access_token_secret]):
        print("Error: Missing Twitter API credentials in environment variables.")
        sys.exit(1)

    try:
        # Authenticate with API v2
        client = tweepy.Client(
            bearer_token=bearer_token,
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_token_secret
        )

        # Create Tweet
        response = client.create_tweet(text=text, in_reply_to_tweet_id=reply_to_id)
        
        # Check for data in response
        if response.data:
            tweet_id = response.data['id']
            return tweet_id
        else:
            print("Error: No data returned from Twitter API.")
            sys.exit(1)
            
    except tweepy.TweepyException as e:
        print(f"Error posting tweet: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python twitter_poster.py <problem_title> <gist_url>")
        sys.exit(1)
        
    problem_title = sys.argv[1]
    gist_url = sys.argv[2]
    
    # Get current day and thread ID
    day = progress_tracker.get_next_day()
    last_thread_id = progress_tracker.get_last_thread_id()
    
    # Construct tweet text
    tweet_text = f"Day {day}\n\n{problem_title}\n\n{gist_url}"
    
    print(f"Posting tweet for Day {day}...")
    
    # Post tweet (replying if thread exists)
    new_tweet_id = post_tweet(tweet_text, reply_to_id=last_thread_id)
    
    if new_tweet_id:
        print(f"Tweet posted successfully! ID: {new_tweet_id}")
        # Update progress
        progress_tracker.save_progress(day, new_tweet_id)
    else:
        print("Failed to post tweet.")
        sys.exit(1)
