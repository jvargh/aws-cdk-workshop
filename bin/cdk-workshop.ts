#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
// import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import { CdkFargateDockerECSPatterns } from '../lib/cdk-fargate-docker-ecs_patterns';
import { CdkFargateDockerECS } from '../lib/cdk-fargate-docker-ecs';
import { CdkQueueLambda } from '../lib/cdk-queue-lambda';
import { CdkQueueDynamoDb } from '../lib/cdk-queue-dynamoDb';

// const app1 = new cdk.App();
// new CdkFargateDockerECSPatterns(app1, 'CdkFargateDockerECSPatterns');
// new CdkFargateDockerECS(app1, 'CdkFargateDockerECS');

const app2 = new cdk.App();
new CdkQueueDynamoDb(app2, 'CdkQueueDynamoDb');
// new CdkQueueLambda(app2, 'CdkQueueLambda');

// app2.synth();
