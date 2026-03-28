import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  satellite_id: string;
  timestamp: string;
  region: string;
  detections: {
    id: number;
    type: string;
    status: string;
    coords: [number, number];
  }[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const randomSatelliteId = `GÖKTÜRK-${Math.floor(Math.random() * 10) + 1}`;
  const randomTimestamp = new Date(
    Date.now() - Math.floor(Math.random() * 3600000),
  ).toISOString();
  const randomRegion =
    Math.random() > 0.5 ? "Antakya/Merkez" : "Defne/Sümerler";
  const randomDetections = [
    {
      id: Math.random() > 0.5 ? 101 : 102,
      type: Math.random() > 0.5 ? "building" : "road",
      status: Math.random() > 0.5 ? "destroyed" : "blocked",
      coords: [36.1 + Math.random() * 0.05, 35.85 + Math.random() * 0.05] as [
        number,
        number,
      ],
    },
  ];
  res.status(200).json({
    satellite_id: randomSatelliteId,
    timestamp: randomTimestamp,
    region: randomRegion,
    detections: randomDetections,
  });
}
