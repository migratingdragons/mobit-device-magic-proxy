#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting deployment process..."

# Step 1: Build the TypeScript project
echo "Building TypeScript project..."
cd device-magic-proxy
npm run build
cd ..

# Step 2: Build the SAM application
echo "Building SAM application..."
sam build

# Step 3: Deploy the SAM application
echo "Deploying SAM application..."
sam deploy --stack-name device-magic-proxy-stack --profile mobit --region eu-west-2 --capabilities CAPABILITY_IAM --no-confirm-changeset

# Step 4: Run the test API script
echo "Running test API script..."
cd device-magic-proxy
bash test_api.sh
cd ..

echo "Deployment process completed successfully!"
