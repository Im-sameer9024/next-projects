import env from "@/app/env";

import {
  Client,
  Users,
  Account,
  Avatars,
  Databases,
  Storage,
} from "node-appwrite";

const client = new Client();

client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.project_id)
  .setKey(env.appwrite.project_api_key);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const users = new Users(client);

export { client, account, databases, storage, avatars, users };
