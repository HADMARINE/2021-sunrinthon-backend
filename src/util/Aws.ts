import AWS from 'aws-sdk';
import error from '@error/ErrorDictionary';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import deasync from 'deasync';
import _logger from 'clear-logger';
const logger = _logger.customName('AWS');

const MULTIPART_SIZE = 5 * 1024 * 1024;

enum status {
  'INITIAL',
  'RESOLVED',
  'ERROR',
}

type SESParam = {
  address: {
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
  subject: string;
  source: string;
  replyTo: string[];
  html: string;
};

async function SES(param: SESParam): Promise<unknown> {
  const ses = new AWS.SES({
    accessKeyId: process.env.SES_PUB_KEY,
    secretAccessKey: process.env.SES_PRIV_KEY,
    region: process.env.SES_REGION,
  });

  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: param.address.to,
      CcAddresses: param.address.cc,
      BccAddresses: param.address.bcc,
    },
    Message: {
      Body: {
        Html: {
          Data: param.html,
          Charset: 'utf-8',
        },
      },
      Subject: {
        Data: param.subject, // 제목 내용
        Charset: 'utf-8',
      },
    },
    Source: param.source, // 보낸 사람 주소
    ReplyToAddresses: param.replyTo, // 답장 받을 이메일 주소
  };

  const result = await new Promise(function (resolve, reject) {
    ses.sendEmail(params).send((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((data) => {
      return data;
    })
    .catch(() => {
      throw error.aws.SES();
    });
  return result;
}

// async function SNS

async function S3UPLOAD(
  param: AWS.S3.PutObjectRequest,
): Promise<ManagedUpload.SendData> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
  });

  return await new Promise(function (resolve, reject) {
    s3.upload(param, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((data) => {
      return data as ManagedUpload.SendData;
    })
    .catch(() => {
      throw error.aws.S3();
    });
}

async function S3UPLOAD_ACCELERATE(
  param: AWS.S3.PutObjectRequest,
): Promise<ManagedUpload.SendData> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
    useAccelerateEndpoint: true,
  });

  return await new Promise(function (resolve, reject) {
    s3.upload(param, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((data) => {
      return data as ManagedUpload.SendData;
    })
    .catch(() => {
      throw error.aws.S3();
    });
}

// async function uploadPart(
//   s3: AWS.S3,
//   multipart: AWS.S3.CreateMultipartUploadOutput,
//   partParams: AWS.S3.UploadPartRequest,
//   preferences: { partLeft: number; currentPart: number },
//   tryNum = 1,
// ): Promise<{ ETag: string | undefined; PartNumber: number }> {
//   let res: { ETag: string | undefined; PartNumber: number };

//   await s3
//     .uploadPart(partParams, function (multiErr, mData) {
//       if (multiErr) {
//         if (tryNum < 3) {
//           uploadPart(s3, multipart, partParams, preferences, tryNum + 1);
//         } else {
//           throw multiErr;
//         }
//       }

//       res = {
//         ETag: mData.ETag,
//         PartNumber: Number(preferences.currentPart),
//       };
//     })
//     .on('httpUploadProgress', function (progress) {
//       logger.debug(
//         `S3 Multipart upload ${Math.round(
//           (progress.loaded / progress.total) * 100,
//         )} % done`,
//         false,
//       );
//     })
//     .promise();

//   // @ts-ignore
//   return res;
// }

// function completeMultipartUpload(
//   s3: AWS.S3,
//   doneParams: AWS.S3.CompleteMultipartUploadRequest,
// ) {
//   return s3
//     .completeMultipartUpload(doneParams, function (err, data) {
//       if (err) throw err;
//     })
//     .promise();
// }

// async function S3UPLOAD_MULTIPART_ACCELRATE(
//   multipartParams: AWS.S3.CreateMultipartUploadRequest,
//   buffer: Buffer,
// ): Promise<AWS.S3.CompleteMultipartUploadOutput> {
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.S3_PUB_KEY,
//     secretAccessKey: process.env.S3_PRIV_KEY,
//     region: process.env.S3_REGION,
//     useAccelerateEndpoint: true,
//   });

//   const multipartMap: { ETag: string | undefined; PartNumber: number }[] = [];

//   let mpGlobal: AWS.S3.CreateMultipartUploadOutput;

//   let STATUS = status.INITIAL;

//   await s3
//     .createMultipartUpload(multipartParams, async (err, mp) => {
//       mpGlobal = mp;

//       if (err) throw err;

//       let partNumber = 0;
//       const partNumLen = Math.ceil(buffer.length / MULTIPART_SIZE);

//       for (let start = 0; start < buffer.length; start += MULTIPART_SIZE) {
//         console.log(start);
//         partNumber++;
//         const end = Math.min(start + MULTIPART_SIZE, buffer.length);
//         if (!mp.UploadId) throw new Error('No upload id');

//         const partParams = {
//           Body: buffer.slice(start, end),
//           Bucket: multipartParams.Bucket,
//           Key: multipartParams.Key,
//           PartNumber: partNumber,
//           UploadId: mp.UploadId,
//         };

//         const uploadRes = await uploadPart(s3, mp, partParams, {
//           currentPart: partNumber,
//           partLeft: partNumLen - partNumber,
//         });
//         multipartMap.push({
//           ETag: uploadRes.ETag,
//           PartNumber: uploadRes.PartNumber,
//         });

//         console.log(uploadRes);

//         if (partNumLen - partNumber <= 0) {
//           STATUS = status.RESOLVED;
//           break;
//         }
//       }
//     })
//     .promise();

//   //@ts-ignore
//   while (STATUS !== status.RESOLVED) {
//     //@ts-ignore
//     if (STATUS === status.ERROR) {
//       throw new Error('S3 Fail');
//     }
//     deasync.sleep(200);
//   }

//   // @ts-ignore
//   if (!mpGlobal.UploadId) {
//     throw new Error('MPGLOBAL UPLOAD ID UNDEFINED');
//   }

//   const doneParams = {
//     Bucket: multipartParams.Bucket,
//     Key: multipartParams.Key,
//     MultipartUpload: { Parts: multipartMap },
//     // @ts-ignore
//     UploadId: mpGlobal.UploadId,
//   };

//   console.log(doneParams);

//   return await completeMultipartUpload(s3, doneParams);
// }

// function S3UPLOAD_MULTIPART() {
//   const s3 = new AWS.S3({
//     accessKeyId: process.env.S3_PUB_KEY,
//     secretAccessKey: process.env.S3_PRIV_KEY,
//     region: process.env.S3_REGION,
//   });
// }

function S3_GET_SIGNED_URL(param: {
  Bucket: string;
  Key: string;
  Expires?: number;
}): Promise<string> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
  });
  return new Promise(function (resolve, reject) {
    s3.getSignedUrl('getObject', param, function (err, url) {
      if (err) reject(err);
      resolve(url);
    });
  })
    .then((url) => {
      return url as string;
    })
    .catch((err: Error) => {
      throw error.aws.S3(err.message);
    });
}

function S3_GET_SIGNED_URL_SYNC(
  param: {
    Bucket: string;
    Key: string;
    Expires?: number;
  },
  syncOptions: { timeout?: number; tick?: number } = {},
): string {
  // TODO: check cpu utilization
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
  });

  let STATUS = status.INITIAL;
  let ERROR;
  let RESULT = '';
  const timeouts = syncOptions.timeout || 10 * 1000;
  const tick = syncOptions.tick || 100;
  const waitUntil = new Date(new Date().getTime() + timeouts);

  s3.getSignedUrl('getObject', param, function (err, url) {
    if (err) {
      STATUS = status.ERROR;
      ERROR = err;
    } else {
      STATUS = status.RESOLVED;
      RESULT = url;
    }
  });

  while (STATUS === status.INITIAL && waitUntil > new Date()) {
    deasync.sleep(tick);
  }

  // @ts-ignore
  if (STATUS === status.RESOLVED) {
    return RESULT;
    // @ts-ignore
  } else if (STATUS === status.ERROR) {
    throw ERROR;
  } else {
    throw new Error(`TIMEOUT FOR S3_GET_SIGNED_URL_SYNC`);
  }
}

export default {
  SES,
  S3: {
    upload: S3UPLOAD,
    uploadAccelerate: S3UPLOAD_ACCELERATE,
    // uploadMultipartAccelerate: S3UPLOAD_MULTIPART_ACCELRATE,
    getSignedUrl: S3_GET_SIGNED_URL,
    getSignedUrlSync: S3_GET_SIGNED_URL_SYNC,
  },
};
