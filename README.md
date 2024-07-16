# self-service

## Requirements
To run self-service localy, you should run the command bellow in the root path after follow to the next steps:
```
npm install
```

## Test
```
npm run test
```

## Validate
```
npm run validate
```

## Infos
The service will be available on port 8080 though localhost:
```
http://localhost:8080/
```

## Development environment
This method only run the typescript to develop. It's not production ready environment
```
npm run dev
```

## Development environment builded to Javascript
```
npm run build
npm run start
```

## Production ready environment
This method uses the Docker compose to build and run the container image of self-service with Postgres as Database.
```
docker compose up
```