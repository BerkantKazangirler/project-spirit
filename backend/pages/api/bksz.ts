import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  bkzs_metadata: {
    signal_integrity: string;
    sync_status: string;
    atomic_clock_offset: string;
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const randomSignalIntegrity =
    Math.pow(Math.random(), 2) > 0.5 ? "high" : "low";
  const randomSyncStatus = Math.random() > 0.5 ? "verified" : "unverified";
  const randomAtomicClockOffset = (Math.random() * 0.01).toFixed(3) + "ns";

  res.status(200).json({
    bkzs_metadata: {
      signal_integrity: randomSignalIntegrity,
      sync_status: randomSyncStatus,
      atomic_clock_offset: randomAtomicClockOffset,
    },
  });
}
