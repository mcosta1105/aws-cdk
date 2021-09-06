import * as lambda from '@aws-cdk/aws-lambda';
import * as apigtw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define an aws lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    })

    const helloWithHitCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigtw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithHitCounter.handler
    })
  }
}
