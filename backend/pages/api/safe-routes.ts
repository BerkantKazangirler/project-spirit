import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  navigation: {
    start_point: [number, number];
    end_point: [number, number];
    calculated_safe_path: [number, number][];
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const randomStartPoint = [
    36.1 + Math.random() * 0.05,
    35.85 + Math.random() * 0.05,
  ] as [number, number];
  const randomEndPoint = [
    36.15 + Math.random() * 0.05,
    35.95 + Math.random() * 0.05,
  ] as [number, number];
  const randomSafePath = [
    randomStartPoint,
    [randomStartPoint[0] + 0.01, randomStartPoint[1] + 0.02],
    randomEndPoint,
  ] as [number, number][];

  res.status(200).json({
    navigation: {
      start_point: randomStartPoint,
      end_point: randomEndPoint,
      calculated_safe_path: randomSafePath,
    },
  });
}
