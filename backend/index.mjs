import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id: 'hits' },
    // Trocamos a palavra reservada 'total' pelo apelido '#t'
    UpdateExpression: 'ADD #t :inc',
    // Explicamos para o banco que '#t' significa a coluna 'total'
    ExpressionAttributeNames: {
      '#t': 'total'
    },
    ExpressionAttributeValues: { ':inc': 1 },
    ReturnValues: 'UPDATED_NEW'
  });

  const result = await dynamo.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Facilita testes no front-end
    },
    body: JSON.stringify({
      total: result.Attributes?.total
    })
  };
};