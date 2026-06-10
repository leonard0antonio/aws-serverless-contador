import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

// 1. O CACHE: Variável global declarada FORA do handler
// O Lambda mantém essa lista viva na memória RAM do container
const cacheDeIps = new Set();

export const handler = async (event) => {
  try {
    // 2. CAPTURA O IP: O API Gateway (Proxy) envia o IP nesta exata rota
    const ipUsuario = event.requestContext?.identity?.sourceIp || 'IP_DESCONHECIDO';
    
    let totalAtual = 0;

    // 3. VERIFICA A REGRA DE NEGÓCIO
    if (cacheDeIps.has(ipUsuario)) {
      // Cenário A: O IP já acessou recentemente. Apenas LÊ o banco sem somar.
      const getCommand = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: 'hits' }
      });
      
      const respostaLeitura = await dynamo.send(getCommand);
      totalAtual = respostaLeitura.Item?.total || 0;
      
    } else {
      // Cenário B: É um IP novo! Soma +1 no banco.
      const updateCommand = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: 'hits' },
        UpdateExpression: 'ADD #t :inc',
        ExpressionAttributeNames: { '#t': 'total' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'UPDATED_NEW'
      });
      
      const respostaAtualizacao = await dynamo.send(updateCommand);
      totalAtual = respostaAtualizacao.Attributes?.total || 0;
      
      // 4. GUARDA O IP: Adiciona ao cache para bloquear as próximas tentativas rápidas
      if (ipUsuario !== 'IP_DESCONHECIDO') {
        cacheDeIps.add(ipUsuario);
      }
    }

    // 5. RETORNA PARA O FRONT-END
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ total: totalAtual })
    };
    
  } catch (erro) {
    console.error("Erro no processamento:", erro);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ mensagem: "Erro interno no servidor" })
    };
  }
};