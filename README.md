# Mobit Device Magic Proxy

This project contains a serverless application that acts as a proxy for Device Magic form submissions. It receives POST requests from Device Magic, processes them based on the form namespace, and forwards them to the appropriate destination.

## Features

- Receives POST requests from Device Magic
- Routes requests based on form namespace
- Forwards requests to configured destinations
- Logs submission details (namespace, submission ID, datetime, success/fail)

## Project Structure

- `hello-world/` - Contains the Lambda function code
- `events/` - Sample events for testing
- `template.yaml` - SAM template defining AWS resources
- `INSTALL.md` - Detailed installation and setup guide

## Getting Started

For detailed installation and setup instructions, please refer to the [INSTALL.md](INSTALL.md) file.

## Usage

After deployment, the application will provide an API Gateway endpoint. Configure Device Magic to send form submissions to this endpoint. The proxy will process the submissions based on the configuration in `config.json`.

## Development

To contribute to this project or make modifications:

1. Clone the repository
2. Make your changes
3. Run tests: `cd hello-world && npm test`
4. Build and deploy using SAM CLI

## Resources

- [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [Device Magic API Documentation](https://www.devicemagic.com/developers/api-documentation/)

For any questions or issues, please open an issue in the project repository.
