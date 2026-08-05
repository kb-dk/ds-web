# ds-web
This is a frontend for showing digital cultural heritage.

## ⚠️ Warning: Copyright Notice
Please note that it is not permitted to download and/or otherwise reuse content from the DR-archive at The Danish Royal Library.


## Project setup
The project requires node v20.10.0.

```
npm install 
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and runs preview build
```
npm run preview
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Local development with Docker Compose and hot reload

Clone frontend `ds-web` repository and then clone `aegis` repository inside `ds-web` to get the `.env` used in `Docker Compose`:

```shell
git clone git@github.com:kb-dk/ds-web.git
cd ds-web
git clone git@github.com:kb-dk/aegis.git
cd ..
```

Your folder structure should now look like this:

```text
{folder_where_you_have_your_repositories}
├── {some_random_repository}
└── ds-web
    └── aegis
```

If you want to have the container using the real services, then change the environment variables in `aegis/docker/ds-web/.env`.

## Start the Docker service

The Docker Compose enables hot reloading.

```shell
docker compose up --detach --build
```

## Service logs

Shows container logs:

```shell
docker compose logs --follow
```
