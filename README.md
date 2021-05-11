# url-short-worker

A simple url shortener using Cloudflare Workers and KV.

## Installation
1. Copy `wranger.toml.example` to `wranger.toml` and fill in the values. You will need to create a KV namespace as well.
2. The code is set up to run behind a one-letter subpath. If you are running it at the root of your domain/subdomain, change the 3 to a 1 in `retrievePath()`.
3. Create a KV entry with key `accesstoken` and set it to be your desired access token for creating/deleting routes.
4. Deploy and enjoy! :D
