import { prisma } from "@/db/prisma";
import build, { OnUnknown } from "pino-abstract-transport";
import internal from "stream";

export default function (opts) {
  return build(async function (source: internal.Transform & OnUnknown) {
    for await (let obj of source) {
      const logEntry = await prisma.logEntry.create({
        data: {
          time: new Date(obj.time),
          level: obj.level,
          data: { ...obj },
        },
      });
    }
  });
}

