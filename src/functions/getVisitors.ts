import VisitorService from '@services/visitors.service';
import db from '@utils/db';
import res from '@utils/res';
import type { APIGatewayProxyHandler } from 'aws-lambda';

const visitorsService = new VisitorService(db);

export const handler: APIGatewayProxyHandler = async (_event) => {
  try {
    const visitors = await visitorsService.getAll();
    if (visitors && visitors[0]) {
      return res(200, visitors);
    }
    return res(204, 'No visitors registered');
  } catch (error) {
    return res(500, error);
  }
};