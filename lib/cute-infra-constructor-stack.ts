import { Construct } from "constructs";
import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";

export class CuteInfraConstructorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Defined origin access identity.
    const originAccessIdentity = new OriginAccessIdentity(this, "cute-oai");

    // Defined s3 bucket.
    const s3BucketSource = new Bucket(this, "cute-bucket", {
      bucketName: "cute-bucket",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Add s3 bucket policy.
    s3BucketSource.addToResourcePolicy(
      new PolicyStatement({
        sid: "PolicyWhichCloudFrontAccessibleToBucket",
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${s3BucketSource.bucketArn}/*`],
        principals: [originAccessIdentity.grantPrincipal],
      })
    );

    // Defined cloudfront distribution.
    new CloudFrontWebDistribution(this, "cute-cloudfront", {
      originConfigs: [
        {
          s3OriginSource: { s3BucketSource, originAccessIdentity },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });
  }
}
