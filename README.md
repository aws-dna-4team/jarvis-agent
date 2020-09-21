
# Getting Started

First Install the skill Jarvis-DevOps, while enabling the skill will ask you to go through SignUp process.
After that (2 steps are necessary to be passed):
1) [Agent-Deployment] You have to install the jarvis-agent inside Your AWS account where DevOps are needed. Go for Deployment section
2) [Account-Binding] You have to log-into Jarvis-Manager service and store Your jarvis-agent address (which you get from step-2)

# Agent-Deployment


## Git clone the project:

```
git clone https://github.com/aws-dna-4team/jarvis-agent.git
```

## Install Serverless Framework (If You already don't have)

```
npm install -g serverless
```

`Note: if there are some problems with installations go to official serverless framework web-site and dissolve it`

## Configure Serverless 

```
# Enter the cloned folder
cd jarvis-agent

# edit the serverless.yml file
# by changing the field provider.profile by setting your aws profile name
# 
# for details about aws-profiles refer to official aws site (aws-cli is topic regarding to this)
#
vi serverless.yml


# deploy the agent
sls deploy -v
```

When the deployment is finished you will find the result something as follows:

```
Stack Outputs
JarvisAgentSubmissionLambdaFunctionQualifiedArn: arn:aws:lambda:ap-southeast-1:447157991422:function:jarvis-agent-dev-jarvisAgentSubmission:1
ServiceEndpoint: https://9rf68d87de.execute-api.ap-southeast-1.amazonaws.com/dev
ServerlessDeploymentBucketName: jarvis-agent-dev-serverlessdeploymentbucket-1a22l6gj9qic0

Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.


   ╭───────────────────────────────────────╮
   │                                       │
   │   Update available 1.71.1 → 2.1.1     │
   │   Run npm i -g serverless to update   │
   │                                       │
   ╰───────────────────────────────────────╯
```

Here You need to copy ServiceEndpoint (in above example it is `https://9rf68d87de.execute-api.ap-southeast-1.amazonaws.com/dev` your will be different) and use it at Account-Binding Step


# Account-Binding

Open `http://reactjarvis-20200913141753-hostingbucket-dev.s3-website-ap-southeast-1.amazonaws.com` and login with credentials you have created at First installation of skill

After login, you have to store ServiceEndpoit(from deployment step) at API field and push the `Store Jarvis-Agent API Address` button.

Now Ready to use !!

# Troubleshootings




## Test
curl -H "Content-Type: application/json" -X GET -d '{"alexaName":"curatorsss","metrics": "CPUUtilization", "lastMinutes":30}' https://9rf68d87de.execute-api.ap-southeast-1.amazonaws.com/dev/candidates