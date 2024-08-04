import swaggerAutogen from 'swagger-autogen';
import { env } from './env';

const PORT = +env.PORT;

const doc = {
    info: {
        version: '1.0.0',
        title: 'Self Service',
        description: 'Self Service API Docs'
    },
    servers: [
        {
            url: 'http://localhost:'+PORT,
            description: 'localhost'
        },
    ]
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app/server.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);