import { prisma } from "@/db/prisma";
import { subMonths } from "date-fns";
import build, { OnUnknown } from "pino-abstract-transport";
import internal from "stream";

export default function () {
  return build(async function (source: internal.Transform & OnUnknown) {
    for await (let obj of source) {
      const deletionThreshold = subMonths(new Date(), 6);

      const deleteOld = await prisma.logEntry.deleteMany({
        where: { time: { lt: deletionThreshold } },
      });

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

