import type { Media, Prisma } from "@orm/generated/prisma-client/client";
import { QueryBuilder } from "@utils/queryBuilder";
import { prisma } from "@lib/prisma";

import {
  mediaFilterableFields,
  mediaIncludeConfig,
  mediaSearchableFields,
} from "./media.constant";
import type { IQueryParams } from "../../interfaces/query";

export const createMediaQueryBuilder = (query: IQueryParams) => {
  const qb = new QueryBuilder<
    Media,
    Prisma.MediaWhereInput,
    Prisma.MediaInclude
  >(prisma.media as any, query as any, {
    searchableFields: mediaSearchableFields,
    filterableFields: mediaFilterableFields,
  });

  qb.dynamicInclude(mediaIncludeConfig);

  return qb;
};

export default createMediaQueryBuilder;
