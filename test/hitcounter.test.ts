import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import cdk = require("@aws-cdk/core");
import * as lambda from "@aws-cdk/aws-lambda";
import { HitCounter } from "../lib/hitcounter";

it("should create a DynamoDB table", () => {
  const stack = new cdk.Stack();
  // When
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "lambda.handler",
      code: lambda.Code.fromInline("test"),
    }),
  });
  //Then
  expectCDK(stack).to(haveResource("AWS::DynamoDB::Table", {
		SSESpecification: {
      SSEEnabled: true
    }
	}));
});

it("should create a lambda and its environment variables", () => {
  const stack = new cdk.Stack();
  // When
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "lambda.handler",
      code: lambda.Code.fromInline("test"),
    }),
  });
  // Then
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          DOWNSTREAM_FUNCTION_NAME: { Ref: "TestFunction22AD90FC" },
          HITS_TABLE_NAME: { Ref: "MyTestConstructHits24A357F0" },
        },
      },
    })
  );
});

it('should return error if readCapacity is < 5 or > 20', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, 'MyTestConstruct', {
      downstream:  new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'lambda.handler',
        code: lambda.Code.inline('test')
      }),
      readCapacity: 3
    });
  }).toThrowError(/readCapacity must be greater than 5 and lower than 20/);
});