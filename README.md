## Getting Started Using NodeJS

create ``.env`` file in the app directory, with the following properties:

```env
OAUTH2_CLIENT_ID=cVst-hietkse9uNr3fdvMnVFh-IOxmC2
OAUTH2_CLIENT_SECRET=************
OAUTH2_CALLBACK_URL=http://localhost:3000/callback
OAUTH2_AUTHORIZATION_URL=https://login-poc.auth0.com/authorize
OAUTH2_TOKEN_URL=https://login-poc.auth0.com/oauth/token
```

run:

```sh
npm i
npm start
```

## Getting Started Using Docker

Using the same ``.env`` file, run:

```sh
docker run --rm -it --env-file .env -p 3000:3000 lpinc/sample-app-auth
```

