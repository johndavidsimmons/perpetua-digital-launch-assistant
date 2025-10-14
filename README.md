# The Perpetua Digital Assistant

This interactive tool helps you work with [Adobe's Reactor API](https://developer.adobe.com/experience-platform-apis/references/reactor/). It's built with [Next.js](https://nextjs.org) and hosted via Vercel. It provides a user-friendly interface for making API calls using your Adobe Launch API credentials. No user data or Launch Property data is stored in a database or on the server.

## Architecture
![Architecture Diagram](/public/images/architecture.png)
[Draw.io Diagram Link](https://drive.google.com/file/d/16ZAGvFH4pYcptr5295Mp9KG376mWRabb/view?usp=sharing)

## Why an API Layer?
There are 3 main reasons that an API layer is needed:
1. The Launch/Reactor API cannot be called directly from the front end of a website due to CORS restrictions.
2. The backend can use the Reactor Node SDK to make the API calls rather than building them from scratch. This greatly simplifies the code.
3. The Launch/Reactor API sends back a lot of unnecessary data. It is more practical to call the Reactor API on the backend, format the data, and return only what is needed to the front end.

### Front end
The front end is built with Next.js and React. The styles are a mixture of [Tailwind CSS](https://tailwindcss.com/) and [Adobe React Spectrum](https://react-spectrum.adobe.com/react-spectrum/getting-started.html).

### Back end
The back end is built with [Vercel](https://vercel.com) and [Next.js](https://nextjs.org).
`Assistant` is a subdomain of `perpetua.digital` which is hosted on Squarespace. 
I would like to transfer this to Vercel at some point. 

**There is no database storage of user data, nor should there be. The goal of this tool is to be a front end for interacting with the Launch API.**

### Building & Deployment
The project will build and deploy immediately on Vercel whenever the `main` branch is updated.

## 🔐 API Keys

Using this app in development or in production requires Adobe Launch API credentials to function. 
To setup a developer project in Adobe Developer Console, [see the video here](https://www.youtube.com/watch?v=5s65A_JFld8).
Here's how we handle your credentials:

1. **Credential Input**: You'll need to provide:
   - Client ID
   - Client Secret
   - Organization ID

2. **Security Measures**:
   - Credentials are only used for immediate API calls and are never stored outside of your browser
   - Credentials are only used for the duration of the API call
   - All data is transmitted securely over HTTPS
   - Credentials are sent via the `x-api-keys` header and are Base64 encoded during transmission
   - The `x-api-keys` header is explicitly redacted in API logging. See `middleware.ts` for details.
   - No data persists between sessions

3. **Best Practices**:
   - Prepare your API credentials with a special read-only product profile. See the video on the [Settings](https://assistant.perpetua.digital/settings) page for more information.
   - Rotate your API keys regularly
   - Never share your API keys

---

## Getting Started

### Local Development with Node

1. Fork this repository and clone it to your local machine
2. Make an `.env.local` file using the values from `.env.sample`.
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. `next dev --experimental-https` should make you an SSL certificate and run the dev server over HTTPS
6. Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.
7. Have at it!

### Docker Setup

#### Prerequisites
- Docker installed

#### Quick Start

1. Fork this repository and clone it to your local machine
2. Make an `.env.local` file using the values from `.env.sample`.
3. Start the development server:
   ```bash
   npm run docker:up
   ```
4. Open [https://localhost:3000](https://localhost:3000) in your browser

#### Docker Commands

```bash
# Start dev server (with logs visible)
npm run docker:up

# Stop dev server
npm run docker:down

# Rebuild the container (after package.json changes)
npm run docker:build

# View logs from running container
npm run docker:logs
```

#### Notes
- NODE_TLS_REJECT_UNAUTHORIZED=0 is set in the docker-compose.yml file to allow self-signed certificates. This is only for development and should not be used in production. This is disabled because your work computer probably would block these requests otherwise and the tool would be unusable. 

## API Routes
The API routes that interact with Launch are under `/api/reactor/`. I have attempted to match the names of the routes to the same as they as named in the [Reactor Node SDK](https://github.com/adobe/reactor-sdk-javascript/tree/master) without being too verbose. 

For example:
`/api/reactor/listdataelements` - Lists the data elements for a property and uses the `reactor.listDataElementsForProperty(propertyId)`. There are some unused routes in the `api/reactor` folder that are leftover from the previous version of this app that may be useful in the future.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.
