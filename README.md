# faunaflix

## Project setup
```
npm install
```

### Run migrations
We're use [fauna-schema-migrate](https://github.com/fauna-labs/fauna-schema-migrate)
Look in `/fauna-schema-migrate` folder 

1. Source FAUNA_ADMIN_KEY for fauna-schema-migrate
  ```
  export FAUNA_ADMIN_KEY=<<admin key>>
  ```
2. Run the migrate script
  ```
  npm run migrate
  ```
3. Run the setup script
  ```
  npm run setup
  ```

### Get an `anonymous` key
Create a file `.env.development.local`
```
VUE_APP_SLS_URI=http://localhost:3000/dev
VUE_APP_FAUNA_KEY_ANONYMOUS=
VUE_APP_CLIENT_ID=
VUE_APP_ISSUER=
VUE_APP_REDIRECT_URI=/login/callback
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
