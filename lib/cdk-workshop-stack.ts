import cdk = require('@aws-cdk/core');
import lambda = require("@aws-cdk/aws-lambda");
import apigw = require("@aws-cdk/aws-apigateway");
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

// import sns = require('@aws-cdk/aws-sns');
// import subs = require('@aws-cdk/aws-sns-subscriptions');
// import sqs = require('@aws-cdk/aws-sqs');


export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lab 2: Lambda
    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_8_10,     // execution environment
      code: lambda.Code.asset('lambda'),  // code loaded from the "lambda" directory
      handler: 'hello.handler'                 // file is "hello", function is "handler"
    });
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table
    });

    // Lab 1 : Queue and Topic
    // new apigw.LambdaRestApi(this, 'Endpoint', {
    //   handler: hello
    // });
    // const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    //
    // const topic = new sns.Topic(this, 'CdkWorkshopTopic');
    // topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
