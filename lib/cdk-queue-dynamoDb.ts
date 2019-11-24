import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import event_sources = require("@aws-cdk/aws-lambda-event-sources");
import sqs = require('@aws-cdk/aws-sqs');
import {Duration} from "@aws-cdk/core";
import dynamoDb = require("@aws-cdk/aws-dynamodb");
// import iam      = require('@aws-cdk/aws-iam');

export class CdkQueueDynamoDb extends cdk.Stack {
    constructor(app: cdk.App, id: string) {
        super(app, id);

        const queue = new sqs.Queue(this, 'MyQueue', {
            visibilityTimeout: Duration.seconds(30),    // default,
            receiveMessageWaitTime: Duration.seconds(20) // default
        });

        const table = new dynamoDb.Table(this, 'CDK-Queue-Table', {
            partitionKey: {
                name: 'id',
                type:dynamoDb.AttributeType.STRING
            }
        });

        const lambdaFn = new lambda.Function(this, 'CDK-Lambda_2', {
            description: 'CDK for Queue using DynamoDB',
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset(`${__dirname}/../lambda`),
            handler: 'index2.handler',
            environment: {
                TABLE_NAME: table.tableName
            },
        });

        // Tie the Lambda Fn to the SQS Queue
        lambdaFn.addEventSource(new event_sources.SqsEventSource(queue));   // batchSize:10 as props

        // Grant table write to lambda
        table.grantReadWriteData(lambdaFn);
    }
}