import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import event_sources = require("@aws-cdk/aws-lambda-event-sources");
import sqs = require('@aws-cdk/aws-sqs');
import {Duration} from "@aws-cdk/core";


export class CdkQueueLambda extends cdk.Stack {
    constructor(app: cdk.App, id: string) {
        super(app, id);

        const queue = new sqs.Queue(this, 'CDK-Queue1', {
            visibilityTimeout: Duration.seconds(30),    // default,
            receiveMessageWaitTime: Duration.seconds(20) // default
        });

        const lambdaFn = new lambda.Function(this, 'CDK-Lambda_1', {
            description: 'CDK for Queue using just Lambda',
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset(`${__dirname}/../lambda`),
            handler: 'index.handler',
        });

        lambdaFn.addEventSource(new event_sources.SqsEventSource(queue));   // batchSize:10 as props
    }
}