# GraphQL Node API Server (Apollo Server + JSON Data Source)

A Node.js GraphQL API server using Apollo Server with JSON files as the data source. Supports nested queries for nodes, actions, triggers, responses, and parent relations.

---

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/hmtanbir/node-graphql-json-api
cd node-graphql-json-api
```

2.**Install dependencies**

```bash
npm install
```

## Run the Project

```bash
npm start
```

The GraphQL server will be available at:

```bash
http://localhost:4000/graphql
```

Sample JWT AUTH TOKEN:
```bash
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJ1c2VybmFtZSI6ImRlbW9Vc2VyIiwiZXhwIjoxNzQ2ODAzNjAwfQ.RZ1p7fw8KjVqW_Fdmlz0OxV6B_1r45yqDdv0lXtNn9c

```

Check query:

```
query Node($nodeId: ID!) {
  node(nodeId: $nodeId) {
    name
    triggerId
    trigger {
      _id
      resourceTemplateId
    }
    responseIds
    actionIds
    parentIds
    parents {
      name
      description
      actionIds
      parentIds
    }
  }
}
```

## CURL request:

```bash
curl --location 'localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJ1c2VybmFtZSI6ImRlbW9Vc2VyIiwiZXhwIjoxNzQ2ODAzNjAwfQ.RZ1p7fw8KjVqW_Fdmlz0OxV6B_1r45yqDdv0lXtNn9c
' \
--data '{"query":"query Node($nodeId: ID!) {\n  node(nodeId: $nodeId) {\n    name\n    triggerId\n    trigger {\n      _id\n      resourceTemplateId\n    }\n    responseIds\n    actionIds\n    parentIds\n    parents {\n      name\n      description\n      actionIds\n      parentIds\n    }\n  }\n}","variables":{"nodeId":"6297164810f52524ba1a9300"}}'
```

## Response:

```bash

{
    "data": {
        "node": {
            "name": "Sign up Webinar",
            "triggerId": "629716db70a0c1202689cd0a",
            "trigger": {
                "_id": "629716db70a0c1202689cd0a",
                "resourceTemplateId": "61e9ba20f9b581f25a2dbf51"
            },
            "responseIds": [
                "6297171270a0c17c5689cd0c"
            ],
            "actionIds": [],
            "parentIds": [
                "6296be3470a0c1052f89cccb"
            ],
            "parents": [
                {
                    "name": "Greeting Message",
                    "description": "",
                    "actionIds": [
                        "6530933e6a1690d2f0c78a92"
                    ],
                    "parentIds": []
                }
            ]
        }
    }
}
```

## AUTHOR
hmtanbir