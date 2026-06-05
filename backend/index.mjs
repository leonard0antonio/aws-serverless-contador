import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Configuramos o cliente do DynamoDB e o nome da tabela a partir das variáveis de ambiente
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

// A função handler é o ponto de entrada da nossa Lambda. Ela será chamada toda vez que a função for invocada.
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

  // Enviamos o comando para o DynamoDB e aguardamos a resposta
  const result = await dynamo.send(command);

  // Retornamos a resposta para o front-end, incluindo o novo valor do contador
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