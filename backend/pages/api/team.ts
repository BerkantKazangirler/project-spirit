import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  mission_id: string;
  teams: {
    id: string;
    name: string;
    type: string;
    assigned_region: string;
    current_coords: [number, number];
    target_coords: [number, number];
    status: string;
    personnel_count: number;
    equipment: string[];
    bkzs_sync: {
      status: string;
      last_sync: string;
    };
  }[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const randomMissionId = `SPIRIT-2026-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

  const randomTeamData = {
    id: `TEAM-${Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")}`,
    name:
      Math.pow(Math.random(), 2) > 0.5 ? "Logistics Team" : "Medical Destek",
    type: Math.random() > 0.5 ? "SAR" : "MED",
    assigned_region: Math.random() > 0.5 ? "Antakya/Merkez" : "Defne/Sümerler",
    current_coords: [
      36.1 + Math.random() * 0.05,
      35.85 + Math.random() * 0.05,
    ] as [number, number],
    target_coords: [
      36.12 + Math.random() * 0.05,
      35.89 + Math.random() * 0.05,
    ] as [number, number],
    status: "on_route",
    personnel_count: Math.random() > 0.5 ? 10 : 8,
    equipment:
      Math.random() > 0.5
        ? ["Thermal Camera", "Acoustic Sensors", "Drone"]
        : ["Mobile Clinic", "Tele-Medicine Kit"],
    bkzs_sync: {
      status: Math.random() > 0.5 ? "active" : "standby",
      last_sync: new Date(
        Date.now() - Math.floor(Math.random() * 600000),
      ).toISOString(),
    },
  };

  res.status(200).json({
    mission_id: randomMissionId,
    teams: [
      {
        id: randomTeamData.id,
        name: randomTeamData.name,
        type: randomTeamData.type,
        assigned_region: randomTeamData.assigned_region,
        current_coords: randomTeamData.current_coords,
        target_coords: randomTeamData.target_coords,
        status: randomTeamData.status,
        personnel_count: randomTeamData.personnel_count,
        equipment: randomTeamData.equipment,
        bkzs_sync: randomTeamData.bkzs_sync,
      },
    ],
  });
}
