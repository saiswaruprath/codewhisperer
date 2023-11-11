import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';






export class CodewhispererStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Create an S3 bucket  
    new cdk.aws_s3.Bucket(this, 'CodewhispererBucket', {   
      versioned: true,
      bucketName: 'codewhisperer-bucket',     
      removalPolicy: cdk.RemovalPolicy.DESTROY,  
      autoDeleteObjects: true,      
    }); 


    // create a vpc   
    const vpc = new cdk.aws_ec2.Vpc(this, 'CodewhispererVpc', {
      natGateways: 0,
      vpcName: 'CodewhispererVpc',
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }
     ]
     
  })

   // create an RDS Instance
   const rdsdemo = new cdk.aws_rds.DatabaseInstance(this, 'CodewhispererRds', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc: vpc,
      databaseName: 'codewhisperer',
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
   });
}
}
