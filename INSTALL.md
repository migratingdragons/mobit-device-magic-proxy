# Mobit Device Magic Proxy - Installation Guide

This guide will walk you through the process of installing, deploying, and setting up the Mobit Device Magic Proxy on AWS.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. SAM CLI installed
4. Node.js 18.x installed
5. Git (optional, for version control)
6. TypeScript installed globally: `npm install -g typescript`
7. jq command-line JSON processor (for running the test_api.sh script)

## Installation Steps

1. Clone the repository (if using Git):
   ```
   git clone https://github.com/migratingdragons/mobit-device-magic-proxy.git
   cd mobit-device-magic-proxy
   ```

2. Install dependencies:
   ```
   cd device-magic-proxy
   npm install
   ```

3. Configure the application:
   - Open `device-magic-proxy/config.json`
   - Update the form namespaces and destination URLs according to your Device Magic forms and desired endpoints

4. Build the TypeScript project:
   ```
   npm run build
   cd ..
   ```

5. Deploy the application:
   ```
   ./deploy.sh
   ```
   This script will build the TypeScript project, build the SAM application, deploy it, and run the test API script.

6. Note the API Gateway endpoint URL from the outputs after deployment. You'll need this URL to configure Device Magic to send form submissions to your proxy.

## Configuration

1. Update the `config.json` file in the `device-magic-proxy` directory with your form namespaces and destination URLs:
   ```json
   [
     {
       "name": "Your Form Name",
       "form_namespace": "http://www.devicemagic.com/xforms/your-form-namespace",
       "destination_url": "https://your-destination-url.com"
     }
   ]
   ```

2. If you make changes to the configuration, redeploy the application by running the `deploy.sh` script again.

## Testing

1. Run the unit tests:
   ```
   cd device-magic-proxy
   npm test
   ```

2. Test the deployed API:
   ```
   cd device-magic-proxy
   ./test_api.sh
   ```
   Make sure to update the `API_ENDPOINT` variable in the `test_api.sh` script with your actual API Gateway endpoint URL.

## Usage

1. Configure Device Magic to send form submissions to the API Gateway endpoint URL provided after deployment.
2. The proxy will forward the data to the configured destination based on the form namespace.
3. Check CloudWatch Logs for detailed logs of each submission processed by the proxy.

## Troubleshooting

- Check CloudWatch Logs for detailed error messages and application logs.
- Ensure that the AWS CLI profile used has the necessary permissions for deployment and execution.
- If you encounter TypeScript-related issues, make sure you have built the project using `npm run build` before deploying.
- If the `test_api.sh` script fails, ensure that `jq` is installed on your system and that the API endpoint URL is correct.
- Verify that the form namespaces in your Device Magic forms exactly match those in your `config.json` file.

## Updating the Application

To update the application:

1. Make your changes to the TypeScript code or configuration.
2. Run `npm run build` in the `device-magic-proxy` directory to compile the TypeScript code.
3. Run `./deploy.sh` from the root directory to deploy the updated application.

For any issues or questions, please contact your system administrator or open an issue in the project repository.
