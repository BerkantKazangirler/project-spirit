import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Team = {
  id: string;
  name: string;
  coords: [number, number];
  signal: string;
  status: string;
};

type Detection = {
  bbox: [number, number, number, number];
  confidence: number;
};

type RadiusTarget = {
  center: [number, number];
  radiusMeters: number;
};

type EvaluatedRoute = {
  coordinates: [number, number][];
  distance: number;
  intersectionCount: number;
  minClearance: number;
  backtrackScore: number;
};

const BASE_LNG = 28.9784;
const BASE_LAT = 41.0082;
const BBOX_SCALE = 0.005;
const RADIUS_PADDING_METERS = 30;
const CIRCLE_STEPS = 48;
const ROUTE_AVOIDANCE_BUFFER_METERS = 22;
const ROUTE_DETOUR_EXTRA_METERS = 26;
const MAX_GUIDE_WAYPOINTS = 4;
const ASTAR_RING_POINTS = 8;

const metersPerDegreeLat = 111320;
const metersPerDegreeLngAt = (lat: number) =>
  111320 * Math.cos((lat * Math.PI) / 180);

const mapBboxToLngLat = (x: number, y: number): [number, number] => [
  BASE_LNG + (x - 0.5) * BBOX_SCALE,
  BASE_LAT - (y - 0.5) * BBOX_SCALE,
];

const calculateRadiusTarget = (
  bbox: [number, number, number, number],
): RadiusTarget => {
  const topLeft = mapBboxToLngLat(bbox[0], bbox[1]);
  const topRight = mapBboxToLngLat(bbox[2], bbox[1]);
  const bottomRight = mapBboxToLngLat(bbox[2], bbox[3]);
  const bottomLeft = mapBboxToLngLat(bbox[0], bbox[3]);

  const lngMin = Math.min(
    topLeft[0],
    topRight[0],
    bottomRight[0],
    bottomLeft[0],
  );
  const lngMax = Math.max(
    topLeft[0],
    topRight[0],
    bottomRight[0],
    bottomLeft[0],
  );
  const latMin = Math.min(
    topLeft[1],
    topRight[1],
    bottomRight[1],
    bottomLeft[1],
  );
  const latMax = Math.max(
    topLeft[1],
    topRight[1],
    bottomRight[1],
    bottomLeft[1],
  );

  const center: [number, number] = [
    (lngMin + lngMax) / 2,
    (latMin + latMax) / 2,
  ];

  const metersPerLng = metersPerDegreeLngAt(center[1]);
  const halfWidthMeters = ((lngMax - lngMin) * metersPerLng) / 2;
  const halfHeightMeters = ((latMax - latMin) * metersPerDegreeLat) / 2;
  const halfDiagonal = Math.sqrt(
    halfWidthMeters * halfWidthMeters + halfHeightMeters * halfHeightMeters,
  );

  return {
    center,
    radiusMeters: halfDiagonal + RADIUS_PADDING_METERS,
  };
};

const createCirclePolygon = (
  center: [number, number],
  radiusMeters: number,
  steps = CIRCLE_STEPS,
): [number, number][][] => {
  const metersPerLng = metersPerDegreeLngAt(center[1]);
  const dLat = radiusMeters / metersPerDegreeLat;
  const dLng = radiusMeters / metersPerLng;

  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    ring.push([
      center[0] + Math.cos(angle) * dLng,
      center[1] + Math.sin(angle) * dLat,
    ]);
  }

  return [ring];
};

const toMeterVector = (
  from: [number, number],
  to: [number, number],
): [number, number] => {
  const meanLat = (from[1] + to[1]) / 2;
  const metersPerLng = metersPerDegreeLngAt(meanLat);
  return [
    (to[0] - from[0]) * metersPerLng,
    (to[1] - from[1]) * metersPerDegreeLat,
  ];
};

const pointFromCenterMeters = (
  center: [number, number],
  dxMeters: number,
  dyMeters: number,
): [number, number] => [
  center[0] + dxMeters / metersPerDegreeLngAt(center[1]),
  center[1] + dyMeters / metersPerDegreeLat,
];

const distancePointToSegmentMeters = (
  point: [number, number],
  segStart: [number, number],
  segEnd: [number, number],
) => {
  const seg = toMeterVector(segStart, segEnd);
  const pointVec = toMeterVector(segStart, point);
  const segLenSq = seg[0] * seg[0] + seg[1] * seg[1];
  if (segLenSq < 1e-6) {
    return Math.sqrt(pointVec[0] * pointVec[0] + pointVec[1] * pointVec[1]);
  }

  const tRaw = (pointVec[0] * seg[0] + pointVec[1] * seg[1]) / segLenSq;
  const t = Math.max(0, Math.min(1, tRaw));
  const projX = seg[0] * t;
  const projY = seg[1] * t;
  const dx = pointVec[0] - projX;
  const dy = pointVec[1] - projY;
  return Math.sqrt(dx * dx + dy * dy);
};

const distanceMeters = (from: [number, number], to: [number, number]) => {
  const vec = toMeterVector(from, to);
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
};

const isPointOutsideHazards = (
  point: [number, number],
  hazards: RadiusTarget[],
  extraClearanceMeters = 0,
) => {
  return hazards.every((hazard) => {
    const distance = distanceMeters(hazard.center, point);
    return (
      distance >=
      hazard.radiusMeters + ROUTE_AVOIDANCE_BUFFER_METERS + extraClearanceMeters
    );
  });
};

const isSegmentOutsideHazards = (
  from: [number, number],
  to: [number, number],
  hazards: RadiusTarget[],
  extraClearanceMeters = 0,
) => {
  return hazards.every((hazard) => {
    const distance = distancePointToSegmentMeters(hazard.center, from, to);
    return (
      distance >=
      hazard.radiusMeters + ROUTE_AVOIDANCE_BUFFER_METERS + extraClearanceMeters
    );
  });
};

const buildAStarGuideWaypoints = (
  start: [number, number],
  end: [number, number],
  hazards: RadiusTarget[],
) => {
  if (hazards.length === 0) return [] as [number, number][];

  const nodes: [number, number][] = [start, end];
  for (const hazard of hazards) {
    const nodeRadius =
      hazard.radiusMeters +
      ROUTE_AVOIDANCE_BUFFER_METERS +
      ROUTE_DETOUR_EXTRA_METERS;

    for (let i = 0; i < ASTAR_RING_POINTS; i += 1) {
      const angle = (i / ASTAR_RING_POINTS) * Math.PI * 2;
      const node = pointFromCenterMeters(
        hazard.center,
        Math.cos(angle) * nodeRadius,
        Math.sin(angle) * nodeRadius,
      );
      if (isPointOutsideHazards(node, hazards, 2)) {
        nodes.push(node);
      }
    }
  }

  const goalIndex = 1;
  const n = nodes.length;
  const gScore = new Array<number>(n).fill(Number.POSITIVE_INFINITY);
  const fScore = new Array<number>(n).fill(Number.POSITIVE_INFINITY);
  const cameFrom = new Array<number>(n).fill(-1);
  const open = new Set<number>([0]);

  gScore[0] = 0;
  fScore[0] = distanceMeters(nodes[0], nodes[goalIndex]);

  while (open.size > 0) {
    let current = -1;
    let bestF = Number.POSITIVE_INFINITY;
    for (const idx of open) {
      if (fScore[idx] < bestF) {
        bestF = fScore[idx];
        current = idx;
      }
    }

    if (current === goalIndex) {
      const pathIndices: number[] = [];
      let walker = current;
      while (walker !== -1) {
        pathIndices.push(walker);
        walker = cameFrom[walker];
      }
      pathIndices.reverse();

      const fullPath = pathIndices.map((idx) => nodes[idx] as [number, number]);
      return fullPath.slice(1, -1).slice(0, MAX_GUIDE_WAYPOINTS);
    }

    open.delete(current);

    for (let next = 0; next < n; next += 1) {
      if (next === current) continue;

      const from = nodes[current] as [number, number];
      const to = nodes[next] as [number, number];
      if (!isSegmentOutsideHazards(from, to, hazards, 1)) continue;

      const tentativeG = gScore[current] + distanceMeters(from, to);
      if (tentativeG >= gScore[next]) continue;

      cameFrom[next] = current;
      gScore[next] = tentativeG;
      fScore[next] = tentativeG + distanceMeters(to, nodes[goalIndex]);
      open.add(next);
    }
  }

  return [] as [number, number][];
};

const getRouteHazardStats = (
  route: [number, number][],
  hazards: RadiusTarget[],
) => {
  let intersectionCount = 0;
  let minClearance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < route.length - 1; i += 1) {
    const segStart = route[i] as [number, number];
    const segEnd = route[i + 1] as [number, number];
    for (const hazard of hazards) {
      const distance = distancePointToSegmentMeters(
        hazard.center,
        segStart,
        segEnd,
      );
      const clearance =
        distance - (hazard.radiusMeters + ROUTE_AVOIDANCE_BUFFER_METERS);
      minClearance = Math.min(minClearance, clearance);
      if (clearance < 0) {
        intersectionCount += 1;
      }
    }
  }

  return {
    intersectionCount,
    minClearance: Number.isFinite(minClearance)
      ? minClearance
      : Number.POSITIVE_INFINITY,
  };
};

const getRouteBacktrackScore = (route: [number, number][]) => {
  let score = 0;

  for (let i = 1; i < route.length - 1; i += 1) {
    const prev = route[i - 1] as [number, number];
    const curr = route[i] as [number, number];
    const next = route[i + 1] as [number, number];

    const v1 = toMeterVector(prev, curr);
    const v2 = toMeterVector(curr, next);
    const len1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
    const len2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
    if (len1 < 2 || len2 < 2) continue;

    const dot = (v1[0] * v2[0] + v1[1] * v2[1]) / (len1 * len2);
    if (dot < -0.2) {
      score += -dot;
    }
  }

  return score;
};

const isBetterRoute = (
  candidate: EvaluatedRoute,
  current: EvaluatedRoute | null,
) => {
  if (!current) return true;

  if (candidate.intersectionCount !== current.intersectionCount) {
    return candidate.intersectionCount < current.intersectionCount;
  }

  if (candidate.minClearance !== current.minClearance) {
    return candidate.minClearance > current.minClearance;
  }

  if (candidate.backtrackScore !== current.backtrackScore) {
    return candidate.backtrackScore < current.backtrackScore;
  }

  return candidate.distance < current.distance;
};

const TEAMS_DATA = [
  {
    id: "ALPHA-01",
    name: "Alpha Team",
    coords: [28.974, 41.006],
    signal: "%98",
    status: "Active",
  },
  {
    id: "ALPHA-02",
    name: "Alpha Team",
    coords: [26.974, 41.006],
    signal: "%98",
    status: "Active",
  },
  {
    id: "BRAVO-02",
    name: "Bravo Team",
    coords: [28.985, 41.008],
    signal: "%92",
    status: "En Route",
  },
] as Team[];

function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const hazardZonesRef = useRef<RadiusTarget[]>([]);
  const routeCacheRef = useRef<globalThis.Map<string, EvaluatedRoute | null>>(
    new globalThis.Map(),
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // SAFE-ROUTER: AI Tespitlerine Göre Dinamik Rota Hesaplama (Simüle)
  const drawSafeRoute = async () => {
    const map = mapRef.current;
    if (!map) return;

    const hazards = hazardZonesRef.current;
    const commandTeam =
      TEAMS_DATA.find((team) => team.id === "ALPHA-01") ?? TEAMS_DATA[0];
    const destinationTeams = TEAMS_DATA.filter(
      (team) => team.id !== commandTeam.id,
    );
    if (destinationTeams.length === 0) return;

    const routeColors = ["#00ff88", "#22d3ee", "#60a5fa", "#34d399"];

    const pointKey = ([lng, lat]: [number, number]) =>
      `${lng.toFixed(6)},${lat.toFixed(6)}`;

    const getBestLegRoute = async (
      from: [number, number],
      to: [number, number],
      routeHazards: RadiusTarget[],
    ): Promise<EvaluatedRoute | null> => {
      const cacheKey = `${pointKey(from)}>${pointKey(to)}|h:${routeHazards.length}`;
      const cached = routeCacheRef.current.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      const encodedPoints = `${from[0]},${from[1]};${to[0]},${to[1]}`;
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${encodedPoints}?geometries=geojson&overview=simplified&alternatives=true&continue_straight=true&access_token=${mapboxgl.accessToken}`,
      );
      const json = await query.json();
      const routeOptions = (json?.routes ?? []) as Array<{
        geometry?: { coordinates?: [number, number][] };
        distance?: number;
      }>;

      let best: EvaluatedRoute | null = null;
      for (const option of routeOptions) {
        const coordinates = option?.geometry?.coordinates;
        if (!coordinates || coordinates.length < 2) continue;

        const stats = getRouteHazardStats(coordinates, routeHazards);
        const evaluated: EvaluatedRoute = {
          coordinates,
          distance: Number(option?.distance ?? Number.POSITIVE_INFINITY),
          intersectionCount: stats.intersectionCount,
          minClearance: stats.minClearance,
          backtrackScore: getRouteBacktrackScore(coordinates),
        };

        if (isBetterRoute(evaluated, best)) {
          best = evaluated;
        }
      }

      routeCacheRef.current.set(cacheKey, best);
      return best;
    };

    const buildRouteForTeam = async (
      start: [number, number],
      end: [number, number],
    ) => {
      const guideWaypoints = buildAStarGuideWaypoints(start, end, hazards);
      const points = [start, ...guideWaypoints, end] as [number, number][];

      const legPromises: Array<Promise<EvaluatedRoute | null>> = [];
      for (let i = 0; i < points.length - 1; i += 1) {
        legPromises.push(getBestLegRoute(points[i], points[i + 1], hazards));
      }

      const legRoutes = await Promise.all(legPromises);
      if (legRoutes.some((leg) => !leg)) return null;

      let stitchedRoute: [number, number][] = [];
      for (let i = 0; i < legRoutes.length; i += 1) {
        const leg = legRoutes[i];
        if (!leg) return null;

        if (i === 0) {
          stitchedRoute = [...leg.coordinates];
        } else {
          stitchedRoute = [...stitchedRoute, ...leg.coordinates.slice(1)];
        }
      }

      return stitchedRoute;
    };

    const routes = await Promise.all(
      destinationTeams.map(async (team, index) => {
        const coordinates = await buildRouteForTeam(
          commandTeam.coords,
          team.coords,
        );
        return { team, coordinates, index };
      }),
    );

    routes.forEach(({ team, coordinates, index }) => {
      if (!coordinates || coordinates.length < 2) return;

      const teamKey = team.id.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      const sourceId = `safe-route-${teamKey}`;
      const layerId = `route-layer-${teamKey}`;
      const lineColor = routeColors[index % routeColors.length];

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates },
          properties: {},
        });
        return;
      }

      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates },
          properties: {},
        },
      });
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": lineColor,
          "line-width": 5,
          "line-opacity": 0.85,
        },
      });
    });
  };

  const handleAIDetection = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:3000/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePath: "public/uploads/test_pre_00538.png",
        }),
      });

      const data = (await response.json()) as Detection[];
      hazardZonesRef.current = data.map((det) =>
        calculateRadiusTarget(det.bbox),
      );

      if (mapRef.current) {
        const source = mapRef.current.getSource(
          "ai-detections",
        ) as mapboxgl.GeoJSONSource;
        const radiusSource = mapRef.current.getSource(
          "ai-detection-radius",
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          const features = data.map((det) => ({
            type: "Feature" as const,
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  mapBboxToLngLat(det.bbox[0], det.bbox[1]),
                  mapBboxToLngLat(det.bbox[2], det.bbox[1]),
                  mapBboxToLngLat(det.bbox[2], det.bbox[3]),
                  mapBboxToLngLat(det.bbox[0], det.bbox[3]),
                  mapBboxToLngLat(det.bbox[0], det.bbox[1]),
                ],
              ],
            },
            properties: { confidence: det.confidence },
          }));
          source.setData({ type: "FeatureCollection", features });

          if (radiusSource) {
            const radiusFeatures = data.map((det) => {
              const target = calculateRadiusTarget(det.bbox);
              return {
                type: "Feature" as const,
                geometry: {
                  type: "Polygon" as const,
                  coordinates: createCirclePolygon(
                    target.center,
                    target.radiusMeters,
                  ),
                },
                properties: { confidence: det.confidence },
              };
            });
            radiusSource.setData({
              type: "FeatureCollection",
              features: radiusFeatures,
            });
          }
        }

        // Analiz bitince rotayı güncelle
        drawSafeRoute();

        mapRef.current.flyTo({
          center: [28.9784, 41.0082],
          zoom: 14.5,
          pitch: 55,
          duration: 900,
        });
      }
    } catch (err) {
      console.error("Hata:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let radiusAnimationFrame: number | null = null;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error("VITE_MAPBOX_TOKEN tanimli degil.");
      return;
    }
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [28.9784, 41.0082],
      zoom: 12.5,
      pitch: 45,
    });

    map.on("load", () => {
      mapRef.current = map;

      // AI Detection Layer
      map.addSource("ai-detections", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "ai-layer",
        type: "fill",
        source: "ai-detections",
        paint: {
          "fill-color": "#FF4B2B",
          "fill-opacity": 0.5,
          "fill-outline-color": "#FFFFFF",
        },
      });

      map.addSource("ai-detection-radius", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "ai-radius-layer",
        type: "line",
        source: "ai-detection-radius",
        paint: {
          "line-color": "#ff4b2b",
          "line-width": 2.8,
          "line-opacity": 0.8,
          "line-blur": 0.25,
        },
      });

      const animateRadiusLayer = (time: number) => {
        if (!map.getLayer("ai-radius-layer")) return;

        // Kalp ritmi: iki hızlı vurgu + kısa dinlenme.
        const cycleMs = 1200;
        const phase = (time % cycleMs) / cycleMs;

        const peak = (x: number, center: number, width: number) => {
          const d = (x - center) / width;
          return Math.exp(-d * d);
        };

        const beat =
          peak(phase, 0.18, 0.06) +
          0.9 * peak(phase, 0.34, 0.055) +
          0.15 * peak(phase, 0.52, 0.12);

        const dynamicWidth = 2.45 + beat * 1.7;
        const dynamicOpacity = 0.74 + beat * 0.2;
        const dynamicBlur = 0.2 + beat * 0.35;

        map.setPaintProperty("ai-radius-layer", "line-width", dynamicWidth);
        map.setPaintProperty("ai-radius-layer", "line-opacity", dynamicOpacity);
        map.setPaintProperty("ai-radius-layer", "line-blur", dynamicBlur);
        radiusAnimationFrame = requestAnimationFrame(animateRadiusLayer);
      };

      radiusAnimationFrame = requestAnimationFrame(animateRadiusLayer);

      // BKZS Mesh Node Markers
      TEAMS_DATA.forEach((team) => {
        const el = document.createElement("div");
        el.className = "bkzs-marker"; // index.css'de tanımlı olmalı
        new mapboxgl.Marker(el)
          .setLngLat(team.coords as [number, number])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<b>${team.name}</b><br>BKZS Sync: ${team.signal}`,
            ),
          )
          .addTo(map);
      });
    });

    return () => {
      if (radiusAnimationFrame !== null) {
        cancelAnimationFrame(radiusAnimationFrame);
      }
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-screen min-h-screen bg-slate-950 overflow-hidden">
      {/* 1. KATMAN: HARİTA (Zorunlu h-full ve w-full) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 w-full h-full"
        style={{ height: "100vh", width: "100vw" }} // CSS'in ezmesine karşı inline-style koruması
      />

      {/* 2. KATMAN: DASHBOARD UI */}
      {/* pointer-events-none: Haritaya tıklamanı engellemez, sadece boş alanları geçişken yapar */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* SOL ÜST PANEL (ANKA Mission Control) */}
        <div className="absolute top-6 left-6 bg-slate-900/90 p-5 rounded-2xl border border-blue-500/30 text-white pointer-events-auto backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <h3 className="text-[10px] font-black text-blue-400 tracking-widest uppercase italic">
              Spirit Mission Control
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-mono font-bold tracking-tighter">
              Accuracy: 44.2%
            </p>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono gap-4">
              <span>BKZS: STABLE</span>
              <span>MESH: 4 NODES</span>
            </div>
          </div>
        </div>

        {/* SAĞ ALT: AKSİYON BUTONU */}
        <button
          onClick={handleAIDetection}
          disabled={isAnalyzing}
          // pointer-events-auto: Butonun tekrar tıklanabilir olmasını sağlar
          className={`absolute bottom-10 right-10 pointer-events-auto px-10 py-5 rounded-full font-black shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all border-2 z-20
            ${
              isAnalyzing
                ? "bg-slate-700 border-slate-500 text-slate-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 border-orange-400 text-white active:scale-95"
            }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin text-xl">🌀</span> VERİ İŞLENİYOR...
            </div>
          ) : (
            "🚀 ANALİZİ VE ROTAYI BAŞLAT"
          )}
        </button>
      </div>
    </div>
  );
}

export default Map;
