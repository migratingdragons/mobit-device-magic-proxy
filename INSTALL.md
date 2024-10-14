# Mobit Device Magic Proxy - Installation Guide

This guide will walk you through the process of installing, deploying, and setting up the Mobit Device Magic Proxy on AWS.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. SAM CLI installed
4. Node.js 18.x installed
5. Git (optional, for version control)
6. TypeScript installed globally: `npm install -g typescript`

## Installation Steps

1. Clone the repository (if using Git):
   ```
   git clone https://github.com/migratingdragons/mobit-device-magic-proxy.git
   cd mobit-device-magic-proxy
   ```

2. Install dependencies and build the TypeScript project:
   ```
   cd device-magic-proxy
   npm install
   npm run build
   cd ..
   ```

3. Build the SAM application:
   ```
   sam build
   ```

4. Deploy the application:
   ```
   sam deploy --guided --profile mobit
   ```
   Follow the prompts to configure your deployment. Make sure to use a unique stack name.

5. Note the API Gateway endpoint URL from the outputs after deployment.

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

2. Redeploy the application after making changes to the configuration:
   ```
   npm run build
   sam build
   sam deploy --profile mobit
   ```

## Testing

Run the unit tests:
```
cd device-magic-proxy
npm test
```

## Usage

Send POST requests to the API Gateway endpoint URL with the Device Magic form data. The proxy will forward the data to the configured destination based on the form namespace.

## Troubleshooting

- Check CloudWatch Logs for detailed error messages and application logs.
- Ensure that the `mobit` AWS CLI profile has the necessary permissions for deployment and execution.
- If you encounter TypeScript-related issues, make sure you have built the project using `npm run build` before deploying.

For any issues or questions, please contact your system administrator or open an issue in the project repository.
