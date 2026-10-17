"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";

export type MapPoint = { name: string; lat: number; lng: number; detail?: string };

export function KeylessMap({ points, center = [24.68, -22.33], zoom = 4.6 }: { points: MapPoint[]; center?: [number, number]; zoom?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      center,
      zoom,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors"
          }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      }
    });

    for (const point of points) {
      new maplibregl.Marker()
        .setLngLat([point.lng, point.lat])
        .setPopup(new maplibregl.Popup({ offset: 18 }).setHTML("<strong>" + point.name + "</strong>" + (point.detail ? "<div>" + point.detail + "</div>" : "")))
        .addTo(map);
    }

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    return () => map.remove();
  }, [points, center, zoom]);

  return <div ref={ref} style={{ width: "100%", height: 340, borderRadius: 18, overflow: "hidden", border: "1px solid #e5e7eb" }} />;
}
