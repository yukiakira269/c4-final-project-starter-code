import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

const client = new XAWS.S3({ signatureVersion: 'v4' })
const bucket = process.env.ATTACHMENT_S3_BUCKET
const todos_table = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()
// TODO: Implement the dataLayer logic
export const getSignedUrl = (todoId: string) => {
    return client.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: todoId,
        Expires: 1000,
    })
}

export const getTodos = async (userId: string) => {
    const params = {
        TableName: todos_table,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    };
    const res = await docClient.query(params).promise();
    const items = res.Items
    return items
}


export const createTodos = async (userId: string, todoId: string, newTodo: any) => {
    const item = {
        userId: userId,
        todoId: todoId,
        attachmentUrl: `http://${bucket}.s3.amazonaws.com/${todoId}`,
        createdAt: new Date().getTime().toString(),
        done: false,
        ...newTodo,
    }
    const params = {
        TableName: todos_table,
        Item: item
    };
    await docClient.put(params).promise();
    return item
}
export const updateTodos = async (userId: string, todoId: string, updatedTodo: any) => {
    const params = {
        TableName: todos_table,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
        UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
            ":name": updatedTodo['name'],
            ":dueDate": updatedTodo['dueDate'],
            ":done": updatedTodo['done']
        },
    };

    return await docClient.update(params).promise()
}
export const deleteTodos = async (userId: string, todoId: string) => {
    const params = {
        TableName: todos_table,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
    };
    return await docClient.delete(params).promise();
}