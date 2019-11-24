import cdk = require('@aws-cdk/core');
import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");    // npm install @aws-cdk/aws-s3-deployment

export class CdkS3Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html
        const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
            websiteIndexDocument: 'index.html',
            publicReadAccess: true
        });

        // https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-deployment-readme.html
        new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset('./website-dist')],
            destinationBucket: websiteBucket,
            destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
        })
    }
}
