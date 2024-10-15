#!/bin/bash

# TODO: Replace this with your actual API Gateway endpoint
API_ENDPOINT="https://e6goocpt8a.execute-api.eu-west-2.amazonaws.com/Prod/proxy"

# Read the first form namespace from config.json
FORM_NAMESPACE=$(jq -r '.[0].form_namespace' config.json)

# Create a payload using the form namespace
PAYLOAD=$(cat <<EOF
{
  "metadata": {
    "form_namespace": "$FORM_NAMESPACE",
    "submission_id": "test-$(date +%s)"
  },
  "device": {
    "identifier": "test-device"
  },
  "form": {
    "id": 12345,
    "name": "Test Form"
  },
  "answers": [
    {
      "question_id": 1,
      "value": "Sample Answer"
    }
  ]
}
EOF
)

# Send POST request
curl -X POST $API_ENDPOINT \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

echo # Print a newline for better readability
