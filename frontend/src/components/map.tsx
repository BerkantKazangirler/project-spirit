import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TEAMS_DATA = [
  {
    id: "ALPHA-01",
    name: "Alpha Team",
    coords: [28.974, 41.006],
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
];

function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // SAFE-ROUTER: AI Tespitlerine Göre Dinamik Rota Hesaplama (Simüle)
  const drawSafeRoute = async () => {
    const map = mapRef.current;
    if (!map) return;

    const start = TEAMS_DATA[0].coords; // Alpha Team [Lng, Lat]
    const end = TEAMS_DATA[1].coords; // Bravo Team [Lng, Lat]

    // Mapbox Navigasyon API'sini çağırıyoruz (Yolları takip etmesi için)
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    );
    const json = await query.json();
    const route = json.routes[0].geometry.coordinates;

    // Haritadaki rotayı güncelle
    if (map.getSource("safe-route")) {
      (map.getSource("safe-route") as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: route },
        properties: {},
      });
    } else {
      map.addSource("safe-route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: route },
          properties: {},
        },
      });
      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "safe-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#00ff88",
          "line-width": 5,
          "line-opacity": 0.8,
        },
      });
    }
  };

  const handleAIDetection = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:3000/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePath: "public/uploads/test_pre_00924.png",
        }),
      });

      const data = await response.json();

      if (mapRef.current) {
        const source = mapRef.current.getSource(
          "ai-detections",
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          const features = data.map((det: any) => ({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [
                    28.9784 + (det.bbox[0] - 0.5) * 0.005,
                    41.0082 - (det.bbox[1] - 0.5) * 0.005,
                  ],
                  [
                    28.9784 + (det.bbox[2] - 0.5) * 0.005,
                    41.0082 - (det.bbox[1] - 0.5) * 0.005,
                  ],
                  [
                    28.9784 + (det.bbox[2] - 0.5) * 0.005,
                    41.0082 - (det.bbox[3] - 0.5) * 0.005,
                  ],
                  [
                    28.9784 + (det.bbox[0] - 0.5) * 0.005,
                    41.0082 - (det.bbox[3] - 0.5) * 0.005,
                  ],
                  [
                    28.9784 + (det.bbox[0] - 0.5) * 0.005,
                    41.0082 - (det.bbox[1] - 0.5) * 0.005,
                  ],
                ],
              ],
            },
            properties: { confidence: det.confidence },
          }));
          source.setData({ type: "FeatureCollection", features });
        }

        // Analiz bitince rotayı güncelle
        drawSafeRoute();

        mapRef.current.flyTo({
          center: [28.9784, 41.0082],
          zoom: 14.5,
          pitch: 55,
          duration: 2500,
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

    return () => map.remove();
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
              Anka Mission Control
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
