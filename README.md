# Mobit Device Magic Proxy

This project contains a serverless application that acts as a proxy for Device Magic form submissions. It receives POST requests from Device Magic, processes them based on the form namespace, and forwards them to the appropriate destination.

## Deployment on Glitch

1. Create a new project on Glitch by importing from GitHub or by creating a new project and copying the files.

2. Once the project is created, Glitch will automatically install the dependencies and build the project.

3. Update the `config.json` file with your form namespaces and destination URLs:

   ```json
   [
     {
       "name": "Your Form Name",
       "form_namespace": "http://www.devicemagic.com/xforms/your-form-namespace",
       "destination_url": "https://your-destination-url.com"
     }
   ]
   ```

4. The application will automatically restart when you make changes.

5. Find your Glitch project URL, which will be in the format: `https://project-name.glitch.me`

## Usage

Send POST requests to `https://your-project-name.glitch.me/proxy` with the Device Magic form data. The proxy will forward the data to the configured destination based on the form namespace.

## Development

To develop locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. Make your changes
5. Build the project: `npm run build`

## Available Scripts

- `npm start`: Run the compiled JavaScript application.
- `npm run build`: Compile TypeScript files to JavaScript.
- `npm run dev`: Run the TypeScript application directly (useful for development).

## Resources

- [Glitch Documentation](https://glitch.com/help/)
- [Device Magic API Documentation](https://www.devicemagic.com/developers/api-documentation/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

For any questions or issues, please open an issue in the project repository or use Glitch's support features.
