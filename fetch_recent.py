import requests
import json
import time
from datetime import datetime

# Replace with your actual LeetCode username
username = "kiru1171"

query = """
query userProblemsSolved($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    recentACSubmissions {
      id
      title
      timestamp
    }
  }
}
"""

variables = {"username": username}
url = "https://leetcode.com/graphql"

response = requests.post(url, json={"query": query, "variables": variables})

if response.status_code != 200:
    raise Exception("Query failed to run with status code {}".format(response.status_code))

data = response.json()
recent = data["data"]["matchedUser"]["recentACSubmissions"]

# Create a dictionary grouped by date
problems_by_date = {}

for item in recent:
    ts = int(item["timestamp"])
    date_str = datetime.utcfromtimestamp(ts).strftime("%Y-%m-%d")
    title = item["title"]

    if date_str not in problems_by_date:
        problems_by_date[date_str] = []

    if title not in problems_by_date[date_str]:
        problems_by_date[date_str].append(title)

# Write to leetcode.json
with open("leetcode.json", "w") as f:
    json.dump(problems_by_date, f, indent=2)

print("✅ leetcode.json updated successfully!")
