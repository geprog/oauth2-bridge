# OAuth2 Bridge

A small UI that allows to proxy oAuth2 providers that does not allow wildcard redirect uris.
This is especially a problem when dealing with review environments or multi tenant environments based on subdomains.

## Usage

Use it via the docker image `ghcr.io/geprog/oauth2-bridge` with the following environment variables

- `NUXT_AUTH_NAME` - the session cookie name. Defaults to `oauth2-bridge-session`
- `NUXT_AUTH_PASSWORD` - the master password for the admin console. Should be a random 64 characters long key.

The docker container exposes the entre app under port `3000`.

To persist data you should mount a volume `/app/data`.

### Managing proxies

In the UI you can configure different proxies.
Per proxy you need to set 
- a `name` (must be unique)
- an authorization URI e.g. `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize` (with your specific tenant id of course)
- a token URI e.g. `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token` (with your specific tenant id of course)

You can also add and remove redirect URIs per proxy.

To use your proxy you need to configure your app to use the following paths of the hosted oauth2-bridge
- Authorization URL `/api/proxies/${proxyName}/bridge/auth`
- Token URL `/api/proxies/${proxyName}/bridge/token`

All the "normal" oauth2 parameters like `clientId`, `clientSecrect` and so on must be define in your app.
OAuth2-Bridge will forward them to the actual oAuth2 provider configured in the proxy.

Only requests matching one of the configured redirect URIs are allowed.

### Adding/Removing redirect URIs

Of course you can add and remove redirect URIs manually via the web app.

But you can also generate an API Token per Proxy.
With this API Token you can add and remove redirect URIs per simple http call from your CI.

To add a redirect URI via curl use
`curl -H "Api-Token: <PROXY_API_TOKEN>" "<OAUTH2_BRIDGE_HOST>/api/proxies/<PROXY_NAME>/redirect-uri/add?redirectUri=<REDIRECT_URI_TO_ADD>"`

To remove a redirect URI via curl use
`curl -H "Api-Token: <PROXY_API_TOKEN>" "<OAUTH2_BRIDGE_HOST>/api/proxies/<PROXY_NAME>/redirect-uri/remove?redirectUri=<REDIRECT_URI_TO_ADD>"`
