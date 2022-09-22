import 'source-map-support/register'

import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk') 
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
//const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getAttachmentUrl(attachmentId: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
}

export function getUploadUrl(attachmentId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: 300
  })
}