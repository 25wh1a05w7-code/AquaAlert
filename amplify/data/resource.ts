import {
  type ClientSchema,
  a,
  defineData,
} from "@aws-amplify/backend";
import { adminDeleteReport } from "../functions/admin-delete-report/resource";

const schema = a
  .schema({
    Todo: a
      .model({
        content: a.string(),
      })
      .authorization((allow) => [allow.publicApiKey()]),

    WaterReport: a
      .model({
        problemType: a.string().required(),
        area: a.string().required(),
        description: a.string().required(),
      })
      .authorization((allow) => [
        allow.publicApiKey().to(["create", "read"]),
        allow.resource(adminDeleteReport).to(["delete"]),
      ]),

    adminDeleteWaterReport: a
      .mutation()
      .arguments({
        id: a.id().required(),
      })
      .returns(a.boolean())
      .handler(a.handler.function(adminDeleteReport))
      .authorization((allow) => [allow.group("Admins")]),
  })
  .authorization((allow) => [
    allow.resource(adminDeleteReport).to(["mutate"]),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
    userPoolAuthorizationMode: {},
  },
});
