import cdk= require("@aws-cdk/core");
import ec2= require("@aws-cdk/aws-ec2");
import ecs= require("@aws-cdk/aws-ecs");
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");

export class CdkFargateDockerECS extends cdk.Stack {
    constructor(scope: cdk.App, id: string) {
        super(scope, id);

        // Create VPC and Fargate Cluster
        const vpc= new ec2.Vpc(this, 'JV-CDK-VPC', {maxAzs: 2});
        const cluster = new ecs.Cluster(this, 'JV-ECS-Cluster', {vpc: vpc});

        // ECS : TaskDef, Containers, Service
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'task-definition', {});

        const container = taskDefinition.addContainer('hello', {
            image: ecs.ContainerImage.fromAsset(`${__dirname}/../apps/hello-world` ),
            memoryLimitMiB: 512,
        });

        container.addPortMappings({containerPort: 3000});

        // Define ECS Fargate Service using taskDefinition which has container added
        const service = new ecs.FargateService(this, 'my-service', {
            cluster: cluster,   desiredCount: 2, taskDefinition: taskDefinition,
            // Ensure that the rollout happens in one round
            maxHealthyPercent: 200, minHealthyPercent: 100,
            // No need for public IP, we have NAT GW in this VPC
            assignPublicIp: false
        });

        // Load balancer for the ECS service
        const LB = new elbv2.ApplicationLoadBalancer(this, 'LB', {
            vpc: vpc,
            internetFacing: true
        });

        const loadBalancer = LB.addListener('PublicListener', {port: 80, open: true});

        loadBalancer.addTargetGroups('default', {
            targetGroups: [new elbv2.ApplicationTargetGroup(this, 'default', {
                vpc: vpc,
                protocol: elbv2.ApplicationProtocol.HTTP,
                port: 80
            })]
        });

        // Output the DNS where you can access your service
        new cdk.CfnOutput(this, 'LoadBalancerDNS', {value: LB.loadBalancerDnsName});

        // add above Fargate service to LB
        loadBalancer.addTargets('my-service', {
            port: 80,   pathPattern: '*', priority: 2,
            // Only 10s for new tasks to be healthy. Increase if app is slow to statup
            healthCheck: {
                healthyThresholdCount: 2,
                interval: cdk.Duration.seconds(5),
                timeout: cdk.Duration.seconds(2)
            },
            // Only drain containers for 10s when stopping them. Increase if app has long lived connections
            deregistrationDelay: cdk.Duration.seconds(10),
            targets: [service]
        });
    }
}
