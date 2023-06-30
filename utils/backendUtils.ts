import { Prisma, Role } from "@prisma/client";

export function getFamilyWhereInput(queryParams: {
  [key: string]: string | string[];
}) {
  let where: Prisma.FamilyWhereInput = {};

  if (queryParams.id) {
    where.id = queryParams.id as string;
  }

  if (queryParams.createdAt) {
    if (Array.isArray(queryParams.createdAt)) {
      where.createdAt = {
        gte: new Date(queryParams.createdAt[0]),
        lte: new Date(queryParams.createdAt[1]),
      };
    } else {
      where.createdAt = new Date(queryParams.createdAt as string);
    }
  }

  if (queryParams.updatedAt) {
    if (Array.isArray(queryParams.updatedAt)) {
      where.updatedAt = {
        gte: new Date(queryParams.updatedAt[0]),
        lte: new Date(queryParams.updatedAt[1]),
      };
    } else {
      where.updatedAt = new Date(queryParams.updatedAt as string);
    }
  }

  if (queryParams.userId) where.userId = queryParams.userId as string;

  if (queryParams.number) {
    if (Array.isArray(queryParams.number)) {
      where.number = {
        gte: parseInt(queryParams.number[0]),
        lte: parseInt(queryParams.number[1]),
      };
    } else {
      where.number = parseInt(queryParams.number as string);
    }
  }

  if (queryParams.childrenInHousehold) {
    if (Array.isArray(queryParams.childrenInHousehold)) {
      where.childrenInHousehold = {
        gte: parseInt(queryParams.childrenInHousehold[0]),
        lte: parseInt(queryParams.childrenInHousehold[1]),
      };
    } else {
      where.childrenInHousehold = parseInt(
        queryParams.childrenInHousehold as string
      );
    }
  }

  if (queryParams.beginOfCare) {
    if (Array.isArray(queryParams.beginOfCare)) {
      where.beginOfCare = {
        gte: new Date(queryParams.beginOfCare[0]),
        lte: new Date(queryParams.beginOfCare[1]),
      };
    } else {
      where.beginOfCare = new Date(queryParams.beginOfCare as string);
    }
  }

  if (queryParams.endOfCare) {
    if (Array.isArray(queryParams.endOfCare)) {
      where.endOfCare = {
        gte: new Date(queryParams.endOfCare[0]),
        lte: new Date(queryParams.endOfCare[1]),
      };
    } else {
      where.endOfCare = new Date(queryParams.endOfCare as string);
    }
  }

  if (queryParams.location) {
    where.location = {
      contains: queryParams.location as string,
      mode: "insensitive",
    };
  }

  if (queryParams.otherInstalledProfessionals) {
    where.otherInstalledProfessionals = {
      contains: queryParams.otherInstalledProfessionals as string,
      mode: "insensitive",
    };
  }

  return where;
}

export function getUserWhereInput(queryParams: {
  [key: string]: string | string[];
}) {
  let where: Prisma.UserWhereInput = {};

  if (queryParams.id) {
    where.id = queryParams.id as string;
  }

  if (queryParams.createdAt) {
    if (Array.isArray(queryParams.createdAt)) {
      where.createdAt = {
        gte: new Date(queryParams.createdAt[0]),
        lte: new Date(queryParams.createdAt[1]),
      };
    } else {
      where.createdAt = new Date(queryParams.createdAt as string);
    }
  }

  if (queryParams.updatedAt) {
    if (Array.isArray(queryParams.updatedAt)) {
      where.updatedAt = {
        gte: new Date(queryParams.updatedAt[0]),
        lte: new Date(queryParams.updatedAt[1]),
      };
    } else {
      where.updatedAt = new Date(queryParams.updatedAt as string);
    }
  }

  if (queryParams.email) {
    where.email = {
      contains: queryParams.email as string,
      mode: "insensitive",
    };
  }

  if (queryParams.name) {
    where.name = {
      contains: queryParams.name as string,
      mode: "insensitive",
    };
  }

  if (queryParams.role) {
    where.role = queryParams.role as Role;
  }

  if (queryParams.organizationId) {
    where.organizationId = queryParams.organizationId as string;
  }

  return where;
}
