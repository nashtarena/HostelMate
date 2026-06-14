import React, { useEffect, useState } from "react";
import { Glass, Badge } from "../components/Common";
import { QrCode, Phone, Wifi, Wind, Bath, BookOpen, Zap } from "lucide-react";
import { apiService } from "../services/api";

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi, "Fan": Wind, "Attached Bath": Bath, "Study Table": BookOpen,
  "AC": Zap,
};

export default function RoomPage() {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMyRoom()
      .then((res: any) => setRoom(res.room || res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-white">My Room</h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>Loading...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-white">My Room</h1>
        <div className="rounded-2xl p-8 text-center" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-white font-semibold">No room assigned yet.</p>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Contact your warden to get a room assigned.</p>
        </div>
      </div>
    );
  }

  const occupants: any[] = room.occupants || [];
  const amenities: string[] = room.amenities || [];
  const isFullyOccupied = room.status === "Full" || occupants.length >= room.capacity;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-white">My Room</h1>

      <Glass className="p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-8xl font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#00D4AA" }}>
              {room.number}
            </div>
            <div className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Floor {room.floor} · Block {room.block}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge label={room.type || "Room"} variant="indigo" />
            <Badge label={isFullyOccupied ? "Occupied" : "Available"} variant={isFullyOccupied ? "green" : "yellow"} />
            {room.monthlyRent && <Badge label={`₹${room.monthlyRent}/mo`} variant="teal" />}
          </div>
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {amenities.map((a) => {
                const Icon = amenityIcons[a] || BookOpen;
                return (
                  <div key={a} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#D1D5DB" }}>
                    <Icon size={14} style={{ color: "#00D4AA" }} />{a}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Glass>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Glass className="p-5">
          <h2 className="text-base font-bold text-white mb-4">
            Roommates ({occupants.length}/{room.capacity})
          </h2>
          {occupants.length === 0 ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>No roommates assigned yet.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {occupants.map((r: any, i: number) => {
                const name = r.name || "Resident";
                const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div key={r._id || i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: i % 2 === 0 ? "rgba(99,102,241,0.3)" : "rgba(0,212,170,0.3)", color: i % 2 === 0 ? "#818CF8" : "#00D4AA" }}>
                      {initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{name}</div>
                      {r.course && <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{r.course}{r.year ? ` · Year ${r.year}` : ""}</div>}
                      {r.phone && (
                        <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: "#6B7280" }}>
                          <Phone size={10} />{r.phone}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Glass>

        <Glass className="p-5 flex flex-col items-center justify-center gap-4">
          <h2 className="text-base font-bold text-white">Room QR Code</h2>
          <div className="w-40 h-40 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <QrCode size={80} style={{ color: "#00D4AA" }} />
          </div>
          <p className="text-sm text-center" style={{ color: "#6B7280" }}>
            Room {room.number} · Block {room.block}
          </p>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 hover:bg-red-500/10"
            style={{ borderColor: "#EF4444", color: "#EF4444" }}>
            Report Room Issue
          </button>
        </Glass>
      </div>
    </div>
  );
}
