import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './env.config.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OneWinq Enterprise Digital Identity API',
      version: '1.0.0',
      description:
        'Production backend API powering OneWinq digital identity platform, including Public profiles, Employee portal, and Admin management.',
      contact: {
        name: 'OneWinq Engineering',
        email: 'support@onewinq.com'
      }
    },
    servers: [
      {
        url: `${env.APP_URL}/api/v1`,
        description: 'API v1 Gateway'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token'
        }
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'RESOURCE_NOT_FOUND' },
                message: { type: 'string', example: 'Resource not found' },
                details: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/modules/**/*.routes.js', './src/routes/*.js']
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
