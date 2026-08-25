import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("COSMOS_CONNECTION_STRING is not set");
}

const client = new CosmosClient(connectionString);
const database = client.database("tairuzz");

export const clientsContainer = database.container("clients");
export const usersContainer = database.container("users");
