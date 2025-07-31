import requests
import json
from email.utils import formatdate

# ✅ Correct username
username = "kiru1711"
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
json_response = response.json()

# ✅ Check if data is returned
if "data" in json_response and "recentAcSubmissionList" in json_response["data"]:
    submissions = json_response["data"]["recentAcSubmissionList"][:3]

    for sub in submissions:
        sub["date"] = formatdate(int(sub["timestamp"]))

    with open("leetcode.json", "w") as f:
        json.dump(submissions, f, indent=2)
    print("✅ LeetCode data successfully written to leetcode.json")
else:
    print("❌ Error: No submission data found in API response.")
