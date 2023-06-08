import 'reflect-metadata'
import { HttpApplication } from './interfaces/http/http.js'
import { prisma } from './shared/infrastructure/prisma/prisma.js'

export function main() {
  const application = HttpApplication.listen(Number(process.env['PORT'])).on('listening', () => {
    const url = `${process.env['API_URL']}`
    console.log(`🚀 Server started at ${url}/docs`)
  })

  const shutdown = () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    application.close(() => {
      console.log('Http server closed.');
      prisma.$disconnect().then(() => {
        console.log('Prisma connection closed.');
        process.exit(0);
      }).catch((error) => {
        console.error('Error occurred while disconnecting from Prisma:', error);
        process.exit(1);
      });
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
