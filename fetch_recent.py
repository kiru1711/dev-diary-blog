import requests
import json
from datetime import datetime

username = "kiru1171"

query = """
query recentAcSubmissions($username: String!) {
  recentAcSubmissionList(username: $username, limit: 20) {
    title
    timestamp
  }
}
"""

variables = {"username": username}
url = "https://leetcode.com/graphql"

response = requests.post(
    url,
    json={"query": query, "variables": variables},
    headers={"Content-Type": "application/json"}
)

if response.status_code != 200:
    raise Exception("Query failed to run with status code {}".format(response.status_code))

data = response.json()
recent = data["data"]["recentAcSubmissionList"]

# Group by date
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
