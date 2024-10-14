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
- `events/` - Sample events for testing
- `template.yaml` - SAM template defining AWS resources
- `INSTALL.md` - Detailed installation and setup guide

## Getting Started

For detailed installation and setup instructions, please refer to the [INSTALL.md](INSTALL.md) file.

## Usage

After deployment, the application will provide an API Gateway endpoint. Configure Device Magic to send form submissions to this endpoint. The proxy will process the submissions based on the configuration in `config.json`.

## Development

This project uses TypeScript. To contribute to this project or make modifications:

1. Clone the repository
2. Install dependencies: `cd device-magic-proxy && npm install`
3. Make your changes
4. Compile TypeScript: `npm run build`
5. Run tests: `npm test`
6. Build and deploy using SAM CLI

To compile the TypeScript code to JavaScript, run:

```
cd device-magic-proxy
npm run build
```

This will generate the compiled JavaScript files in the `dist` directory.

## Resources

- [AWS SAM Developer Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [Device Magic API Documentation](https://www.devicemagic.com/developers/api-documentation/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

For any questions or issues, please open an issue in the project repository.
