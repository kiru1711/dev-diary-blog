import requests
import json

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
submissions = response.json()["data"]["recentAcSubmissionList"][:3]

for sub in submissions:
    sub["date"] = requests.utils.formatdate(int(sub["timestamp"]))

with open("leetcode.json", "w") as f:
    json.dump(submissions, f, indent=2)
