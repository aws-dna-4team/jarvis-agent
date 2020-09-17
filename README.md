

# Deployment
sls deploy -v


## Test
curl -H "Content-Type: application/json" -X GET -d '{"alexaName":"curatorsss","metrics": "CPUUtilization", "lastMinutes":30}' https://9rf68d87de.execute-api.ap-southeast-1.amazonaws.com/dev/candidates