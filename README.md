# WEAO Proxy API

This project is a proxy server designed to access the [Whatexpsare.online](https://whatexpsare.online/) API by adding the required `User-Agent` header to requests. This will ensure that your requests to the API are not blocked by Cloudflare.

## Purpose

When I was developing a simple template website using the Whatexpsare.online API, I encountered issues with requests being blocked due to CORS restrictions. After discussing this with the API owner, we couldn't find a solution but he did say he will fix the CORS Issue. Therefore, with their permission, I created this open-source proxy server to make the API accessible to everyone without such restrictions.

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

To use the proxy server, send your requests to the following endpoints:

- Fetch current Roblox versions: `http://localhost:3000/api/versions/current`
- Fetch future Roblox versions: `http://localhost:3000/api/versions/future`
- Fetch exploit status: `http://localhost:3000/api/status/exploits`

These endpoints will accept your requests to the [Whatexpsare.online](https://whatexpsare.online/) API with the correct `User-Agent` headers and return the response.

## License

This project is free to use. Note that I am not the owner of the actual API.

