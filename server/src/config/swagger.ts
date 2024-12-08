import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TE.KG API Documentation',
      version: '1.0.0',
      description: 'API документация для проекта TE.KG',
      contact: {
        name: 'API Support',
        url: 'https://te.kg/support',
        email: 'support@te.kg'
      },
    },
    servers: [
      {
        url: 'https://api.te.kg',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'], // путь к файлам с маршрутами
};

export const swaggerSpec = swaggerJsdoc(options);
