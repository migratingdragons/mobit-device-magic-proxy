# Mobit Device Magic Proxy

This project contains a serverless application that acts as a proxy for Device Magic form submissions. It receives POST requests from Device Magic, processes them based on the form namespace, and forwards them to the appropriate destination.

## Features

- Receives POST requests from Device Magic
- Routes requests based on form namespace
- Forwards requests to configured destinations
- Logs submission details (namespace, submission ID, datetime, success/fail)
- Written in TypeScript for improved type safety and developer experience

## Project Structure

- `device-magic-proxy/` - Contains the Lambda function code
  - `app.ts` - Main application logic
  - `types/` - TypeScript type definitions
  - `tests/` - Unit tests
  - `config.json` - Configuration file for form namespaces and destinations
  - `test_api.sh` - Script for testing the deployed API
- `events/` - Sample events for testing
- `template.yaml` - SAM template defining AWS resources
- `deploy.sh` - Deployment script
- `INSTALL.md` - Detailed installation and setup guide

## Getting Started

For detailed installation and setup instructions, please refer to the [INSTALL.md](INSTALL.md) file.

## Deployment

The project includes a `deploy.sh` script in the root directory that automates the deployment process. This script:

1. Builds the TypeScript project
2. Builds the SAM application
3. Deploys the SAM application
4. Runs the test API script

To deploy the application, run:

```bash
./deploy.sh
```

Make sure you have the necessary AWS credentials and permissions set up before running the deployment script.

## Usage

After deployment, the application will provide an API Gateway endpoint. Configure Device Magic to send form submissions to this endpoint. The proxy will process the submissions based on the configuration in `config.json`.

## Testing

### Unit Tests

To run the unit tests:

1. Navigate to the `device-magic-proxy` directory:
   ```
   cd device-magic-proxy
   ```

2. Install dependencies if you haven't already:
   ```
   npm install
   ```

3. Run the tests:
   ```
   npm test
   ```

### Testing the Deployed Application

After deploying the application, you can test it using the provided bash script `test_api.sh`. This script sends a POST request to your API Gateway endpoint with a sample payload based on your actual configuration.

To use the script:

1. Ensure you have `jq` installed on your system.

2. Navigate to the `device-magic-proxy` directory:
   ```
   cd device-magic-proxy
   ```

3. Update the `API_ENDPOINT` variable in `test_api.sh` with your actual API Gateway endpoint URL.

4. Make the script executable (if it's not already):
   ```
   chmod +x test_api.sh
   ```

5. Run the test:
   ```
   ./test_api.sh
   ```

## Development

This project uses TypeScript. To contribute to this project or make modifications:

1. Clone the repository
2. Install dependencies: `cd device-magic-proxy && npm install`
3. Make your changes
4. Compile TypeScript: `npm run build`
5. Run tests: `npm test`
6. Build and deploy using the `deploy.sh` script

## Available Scripts

- `npm run build`: Compile TypeScript files to JavaScript.
- `npm test`: Run the unit tests.
- `npm run lint`: Run TypeScript's type checking without emitting files.

## Resources

- [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [Device Magic API Documentation](https://www.devicemagic.com/developers/api-documentation/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

For any questions or issues, please open an issue in the project repository.
