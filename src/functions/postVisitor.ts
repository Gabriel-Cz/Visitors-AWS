import VisitorService from '@services/visitors.service';
import db from '@utils/db';
import res from '@utils/res';
import geoip from 'geoip-lite';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import type { DocumentClient } from 'aws-sdk/clients/dynamodb';

const visitorsService = new VisitorService(db);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const ip = event.requestContext.identity.sourceIp;
    const referer = event.headers['Referer'];
    const visitor = await visitorsService.getOne(ip);
    if (visitor) {
      return res(200, 'Visitor already registered by IP');
    }
    const geo = geoip.lookup(ip || '');
    const payload: DocumentClient.PutItemInput = {
      TableName: visitorsService.tableName,
      Item: {
        ip,
        referer,
        createdAt: new Date(),
        city: (geo ? geo.city : '')
      }
    }
    const newVisitor = await visitorsService.create(payload);
    if (newVisitor) {
      return res(201, visitor);
    }
    return res(204, 'No visitor registered');
  } catch (error) {
    console.log(error);
    return res(500, error);
  }
};

