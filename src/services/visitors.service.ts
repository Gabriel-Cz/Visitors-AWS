import { DocumentClient, PutItemInput, ScanOutput } from "aws-sdk/clients/dynamodb";

export default class VisitorService {
  public tableName: string = 'Visitors';

  constructor(private db: DocumentClient) {}
    
  async getAll(): Promise<ScanOutput['Items']> {
    const visitors = await this.db.scan({
      TableName: this.tableName,
    }).promise();
    return visitors.Items;
  }

  async getOne(ip: string): Promise<DocumentClient.GetItemOutput['Item']> {
    const visitor = await this.db.get({
      TableName: this.tableName,
      Key: { ip }
    }).promise();
    return visitor.Item;
  }

  async create(payload: PutItemInput): Promise<PutItemInput> {
    await this.db.put(payload).promise();
    return payload;
  }
}