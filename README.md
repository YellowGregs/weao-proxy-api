# WEAO Proxy API

I decided to create this proxy server to access the [Whatexpsare.online](https://whatexpsare.online/) API by adding the necessary `User-Agent` header to requests. This ensures that your requests to the API are not blocked by Cloudflare.

## Purpose

When I was developing a simple template website using the Whatexpsare.online API, I encountered a issue with the requests being blocked due to CORS restrictions, and after discussing this with the API owner about the problem, we couldn't find a solution but he did say he will fix the CORS Issue. Therefore, with his permission, I created this open-source proxy server to make the API accessible to everyone without restrictions.

## Getting Started

### Requirements

- Node.js and npm installed.

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/YellowGregs/weao-proxy-api.git
    cd weao-proxy-api
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server:

    ```sh
    node server.mjs
    ```

### Usage

To use the proxy server, send your requests to these endpoints:

- Fetch current Roblox versions: `http://localhost:3000/api/versions/current`
- Fetch future Roblox versions: `http://localhost:3000/api/versions/future`
- Fetch Android latest version: `http://localhost:3000/api/versions/android`
- Fetch all exploit statuses: `http://localhost:3000/api/status/exploits`
- Fetch a specific exploit status: `http://localhost:3000/api/status/exploits/[exploit]` (Replace `[exploit]` with the name of the executor. Example: `solara`)


These endpoints will accept your requests to the [Whatexpsare.online](https://whatexpsare.online/) API with the correct User-Agent headers and return the response.

WEAO Documentation: [WEAO Documentation](https://docs.weao.xyz/)

## License

This project is free to use. Note that I am not the owner of the actual API; I made this proxy API for myself to code a simple website template of there API.

