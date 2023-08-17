import * as AWS from 'aws-sdk'

const client = new AWS.S3({ signatureVersion: 'v4' })
const bucket = process.env.ATTACHMENT_S3_BUCKET
// TODO: Implement the fileStogare logic
export const generateUploadUrl = (todoId: string) => {
    return client.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: todoId,
        Expires: 1000,
    })
}