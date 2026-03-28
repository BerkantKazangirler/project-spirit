import sys
import json
import os
os.environ['YOLO_VERBOSE'] = 'False' 
from ultralytics import YOLO

def run_inference(image_path):
    try:
        if not os.path.exists(image_path):
            print(json.dumps({"error": f"Resim bulunamadi: {image_path}"}))
            return

        model = YOLO('runs/detect/train/weights/best.pt', verbose=False)
        
        results = model(image_path, verbose=False)
        
        detections = []
        for r in results:
            boxes = r.boxes.xyxyn.tolist() 
            confidences = r.boxes.conf.tolist()
            for box, conf in zip(boxes, confidences):
                detections.append({
                    "bbox": box,
                    "confidence": round(conf, 4)
                })
        
        print(json.dumps(detections))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_inference(sys.argv[1])