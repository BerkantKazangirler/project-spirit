import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, TrendingUp, Activity, Zap, AlertTriangle } from "lucide-react";

export function AIAnalytics() {
  // mAP50 Accuracy data
  const accuracyData = [
    { epoch: 0, mAP50: 0, validation: 0 },
    { epoch: 10, mAP50: 45.2, validation: 42.8 },
    { epoch: 20, mAP50: 67.3, validation: 65.1 },
    { epoch: 30, mAP50: 78.9, validation: 76.4 },
    { epoch: 40, mAP50: 85.6, validation: 83.2 },
    { epoch: 50, mAP50: 89.4, validation: 87.8 },
    { epoch: 60, mAP50: 91.7, validation: 90.1 },
    { epoch: 70, mAP50: 93.2, validation: 91.6 },
    { epoch: 80, mAP50: 94.1, validation: 92.8 },
    { epoch: 90, mAP50: 94.5, validation: 93.4 },
    { epoch: 100, mAP50: 94.7, validation: 93.9 },
  ];

  // Loss curves data
  const lossData = [
    { epoch: 0, trainLoss: 4.8, valLoss: 4.9 },
    { epoch: 10, trainLoss: 3.2, valLoss: 3.4 },
    { epoch: 20, trainLoss: 2.1, valLoss: 2.3 },
    { epoch: 30, trainLoss: 1.5, valLoss: 1.7 },
    { epoch: 40, trainLoss: 1.1, valLoss: 1.3 },
    { epoch: 50, trainLoss: 0.8, valLoss: 1.0 },
    { epoch: 60, trainLoss: 0.6, valLoss: 0.8 },
    { epoch: 70, trainLoss: 0.5, valLoss: 0.7 },
    { epoch: 80, trainLoss: 0.4, valLoss: 0.6 },
    { epoch: 90, trainLoss: 0.3, valLoss: 0.5 },
    { epoch: 100, trainLoss: 0.25, valLoss: 0.45 },
  ];

  // Before/After satellite imagery samples
  const satelliteImages = [
    {
      id: "IMG-001",
      location: "Zone Alpha",
      timestamp: "2026-03-28 14:23:45",
      detections: 12,
      confidence: 0.947,
    },
    {
      id: "IMG-002",
      location: "Zone Bravo",
      timestamp: "2026-03-28 14:25:12",
      detections: 8,
      confidence: 0.892,
    },
    {
      id: "IMG-003",
      location: "Zone Charlie",
      timestamp: "2026-03-28 14:27:33",
      detections: 15,
      confidence: 0.934,
    },
    {
      id: "IMG-004",
      location: "Zone Delta",
      timestamp: "2026-03-28 14:29:56",
      detections: 6,
      confidence: 0.878,
    },
  ];

  return (
    <div className="h-full bg-[#0F1419] overflow-auto p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-6 h-6 text-[#00D1FF]" />
              <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                AI Analytics & Training Lab
              </h1>
            </div>
            <p className="text-sm text-gray-400">
              Model Performance Monitoring & Training Metrics
            </p>
          </div>

          <div className="flex gap-3">
            <Card className="bg-[#1A1F2E] border border-[#00D1FF]/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00D1FF]" />
                <div>
                  <div className="text-xs text-gray-500">Model Status</div>
                  <div className="text-sm font-bold text-[#00D1FF]">
                    TRAINING
                  </div>
                </div>
              </div>
            </Card>
            <Card className="bg-[#1A1F2E] border border-[#FF8A00]/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF8A00]" />
                <div>
                  <div className="text-xs text-gray-500">GPU Utilization</div>
                  <div className="text-sm font-bold text-[#FF8A00]">87%</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#00D1FF]/10 to-[#0080FF]/10 border border-[#00D1FF]/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Current mAP50
              </span>
              <TrendingUp className="w-4 h-4 text-[#00D1FF]" />
            </div>
            <div className="text-3xl font-black text-white mb-1">94.7%</div>
            <div className="flex items-center gap-1 text-xs text-[#00D1FF]">
              <TrendingUp className="w-3 h-3" />
              <span>+2.3% vs last epoch</span>
            </div>
          </Card>

          <Card className="bg-[#1A1F2E] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Training Loss
              </span>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">0.25</div>
            <div className="text-xs text-gray-500">Epoch 100/150</div>
          </Card>

          <Card className="bg-[#1A1F2E] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Inference Speed
              </span>
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">47ms</div>
            <div className="text-xs text-gray-500">Per frame @ 1080p</div>
          </Card>

          <Card className="bg-[#1A1F2E] border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Dataset Size
              </span>
              <Brain className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">156K</div>
            <div className="text-xs text-gray-500">Annotated images</div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* mAP50 Accuracy Chart */}
          <Card className="bg-[#1A1F2E] border border-[#00D1FF]/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                  mAP50 Accuracy Over Time
                </h3>
                <p className="text-xs text-gray-400">
                  Training vs Validation Performance
                </p>
              </div>
              <Badge className="bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/30">
                YOLOv8
              </Badge>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" />
                <XAxis
                  dataKey="epoch"
                  stroke="#6B7280"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  label={{
                    value: "Epoch",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#9CA3AF",
                  }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  label={{
                    value: "mAP50 (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#9CA3AF",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1F2E",
                    border: "1px solid #00D1FF",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mAP50"
                  stroke="#00D1FF"
                  strokeWidth={3}
                  dot={{ fill: "#00D1FF", r: 4 }}
                  name="Training mAP50"
                />
                <Line
                  type="monotone"
                  dataKey="validation"
                  stroke="#FF8A00"
                  strokeWidth={3}
                  dot={{ fill: "#FF8A00", r: 4 }}
                  name="Validation mAP50"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Loss Curves Chart */}
          <Card className="bg-[#1A1F2E] border border-[#FF8A00]/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                  Loss Curves
                </h3>
                <p className="text-xs text-gray-400">
                  Training & Validation Loss Convergence
                </p>
              </div>
              <Badge className="bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/30">
                MSE Loss
              </Badge>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={lossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" />
                <XAxis
                  dataKey="epoch"
                  stroke="#6B7280"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  label={{
                    value: "Epoch",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#9CA3AF",
                  }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  label={{
                    value: "Loss",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#9CA3AF",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1F2E",
                    border: "1px solid #FF8A00",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="trainLoss"
                  stroke="#00D1FF"
                  fill="#00D1FF"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Training Loss"
                />
                <Area
                  type="monotone"
                  dataKey="valLoss"
                  stroke="#FF8A00"
                  fill="#FF8A00"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Validation Loss"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Before/After Satellite Imagery Grid */}
        <Card className="bg-[#1A1F2E] border border-[#00D1FF]/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">
                Satellite Imagery Analysis
              </h3>
              <p className="text-xs text-gray-400">
                Before vs After AI Detection with Bounding Boxes
              </p>
            </div>
            <button className="px-4 py-2 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-lg text-xs font-bold text-[#00D1FF] hover:bg-[#00D1FF]/20 transition-colors">
              REFRESH FEED
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {satelliteImages.map((img) => (
              <Card
                key={img.id}
                className="bg-[#0F1419] border border-white/10 overflow-hidden"
              >
                <div className="grid grid-cols-2">
                  {/* Before */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 border-r border-white/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Simulated satellite image */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-gray-600 opacity-50"></div>
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gray-600 opacity-50"></div>
                        <div className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-gray-600 opacity-50"></div>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-[#0F1419]/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Original
                    </div>
                  </div>

                  {/* After (with bounding boxes) */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Simulated satellite image with detections */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-gray-600 opacity-50"></div>
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gray-600 opacity-50"></div>
                        <div className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-gray-600 opacity-50"></div>

                        {/* AI Bounding Boxes */}
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 border-2 border-[#00D1FF] shadow-lg shadow-[#00D1FF]/50">
                          <div className="absolute -top-5 left-0 bg-[#00D1FF] px-1 text-[8px] font-bold text-black">
                            STRUCT 94%
                          </div>
                        </div>
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-[#FF8A00] shadow-lg shadow-[#FF8A00]/50">
                          <div className="absolute -top-5 left-0 bg-[#FF8A00] px-1 text-[8px] font-bold text-black">
                            HAZARD 89%
                          </div>
                        </div>
                        <div className="absolute bottom-1/4 left-1/2 w-10 h-10 border-2 border-[#00D1FF] shadow-lg shadow-[#00D1FF]/50">
                          <div className="absolute -top-5 left-0 bg-[#00D1FF] px-1 text-[8px] font-bold text-black">
                            ROAD 87%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-[#00D1FF]/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider">
                      AI Detected
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#00D1FF] mb-1">
                        {img.id}
                      </div>
                      <div className="text-xs text-white font-medium">
                        {img.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Confidence</div>
                      <div className="text-sm font-bold text-[#00D1FF]">
                        {(img.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-mono">
                      {img.timestamp}
                    </span>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[#FF8A00]" />
                      <span className="text-white font-bold">
                        {img.detections} Objects
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
