import type { Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/admin-delete-report";

const { resourceConfig, libraryOptions } =
  await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

type Handler = Schema["adminDeleteWaterReport"]["functionHandler"];

export const handler: Handler = async (event) => {
  const { data, errors } = await client.models.WaterReport.delete({
    id: event.arguments.id,
  });

  if (errors?.length || !data) {
    throw new Error("Unable to delete the water report.");
  }

  return true;
};
