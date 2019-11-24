import cdk= require("@aws-cdk/core");
import ec2= require("@aws-cdk/aws-ec2");
import ecs= require("@aws-cdk/aws-ecs");
import ecs_patterns= require("@aws-cdk/aws-ecs-patterns");
// import path = require('path');

export class CdkFargateDockerECSPatterns extends cdk.Stack {
    constructor(scope: cdk.App, id: string) {
        super(scope, id);

        const vpc= new ec2.Vpc(this, 'JV-CDK-VPC', {maxAzs: 2});
        const cluster = new ecs.Cluster(this, 'JV-ECS-Cluster', {vpc: vpc});

        // changing fromAsset to fromRegistry will need change of file name for CF to pickup changes
        new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'JV-FargateService',{
            cluster: cluster,
            taskImageOptions: {
                containerPort : 3000,
                image: ecs.ContainerImage.fromAsset(`${__dirname}/../apps/hello-world` ),
                // image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
            },
        });
    }
}

// const app = new cdk.App();
// new CdkFargateAppStack(app, 'CDK-Fargate-Service');
// app.synth();