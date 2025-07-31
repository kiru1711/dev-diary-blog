import requests
import json
from datetime import datetime

username = "kiru1171"
url = "https://leetcode.com/graphql"

headers = {
    "Content-Type": "application/json",
    "Referer": f"https://leetcode.com/{username}/",
    "User-Agent": "Mozilla/5.0"
}

query = {
    "operationName": "recentAcSubmissions",
    "variables": {
        "username": username
    },
    "query": """
    query recentAcSubmissions($username: String!) {
      recentAcSubmissionList(username: $username) {
        title
        timestamp
      }
    }
    """
}

response = requests.post(url, json=query, headers=headers)
submissions = response.json()["data"]["recentAcSubmissionList"]

# Group by date
datewise = {}

for sub in submissions:
    # Convert timestamp to YYYY-MM-DD (UTC)
    date = datetime.utcfromtimestamp(int(sub["timestamp"])).strftime("%Y-%m-%d")
    if date not in datewise:
        datewise[date] = []
    if sub["title"] not in datewise[date]:  # prevent duplicates
        datewise[date].append(sub["title"])

# Save grouped submissions
with open("leetcode.json", "w") as f:
    json.dump(datewise, f, indent=2)
