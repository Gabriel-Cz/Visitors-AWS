import { APIGatewayProxyResult } from "aws-lambda";

const res = (statusCode: number, body: any): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }
}

export default res;