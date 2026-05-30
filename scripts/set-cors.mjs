import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://lasallian-me.dev.app.dlsu-lscs.org' 
];

await s3.send(
  new PutBucketCorsCommand({
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        // Cors rule for local development
        {
          AllowedOrigins: ['http://localhost:3000'],
          AllowedMethods: ['PUT'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600,
        },
        // Cors rule for deployment
        {
          AllowedOrigins: ['https://lasallian-me.dev.app.dlsu-lscs.org'],
          AllowedMethods: ['PUT'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }),
);

console.log('CORS rules set successfully on bucket:', process.env.S3_BUCKET);
console.log('Allowed origins:', allowedOrigins);
