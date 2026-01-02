import os
import requests
import sys
import json
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

def create_gist(filename, content):
    """
    Creates a public GitHub Gist.
    
    Args:
        filename (str): The name of the file in the gist.
        content (str): The content of the file.
        
    Returns:
        str: The URL of the created gist.
    """
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        print("Error: GITHUB_TOKEN environment variable not set.")
        sys.exit(1)

    url = "https://api.github.com/gists"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    data = {
        "description": f"LeetCode Solution: {filename}",
        "public": True,
        "files": {
            filename: {
                "content": content
            }
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result["html_url"]
    except requests.exceptions.RequestException as e:
        print(f"Error creating gist: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python gist_publisher.py <filename> <content_file_path>")
        sys.exit(1)
        
    filename = sys.argv[1]
    content_path = sys.argv[2]
    
    try:
        with open(content_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        gist_url = create_gist(filename, content)
        print(gist_url)
    except FileNotFoundError:
        print(f"Error: File not found - {content_path}")
        sys.exit(1)
