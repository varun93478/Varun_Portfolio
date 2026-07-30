import { ImageResponse } from "next/og";

export const alt = "Varun J — Complex Systems Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const nodes = [
  { label: "ROLES", left: 770, top: 150 },
  { label: "RULES", left: 990, top: 150 },
  { label: "DATA", left: 770, top: 370 },
  { label: "DECISIONS", left: 990, top: 370 },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#f7f7f4",
        color: "#17181a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ position: "absolute", inset: 24, border: "2px solid #3155e7", display: "flex" }} />
      <div style={{ position: "absolute", left: 48, top: 42, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: "#3155e7", color: "white", fontSize: 15, fontWeight: 700 }}>V</div>
        <div style={{ display: "flex", fontSize: 16, fontWeight: 700 }}>VARUN J</div>
        <div style={{ display: "flex", color: "#6d6f73", fontSize: 13 }}>COMPLEX SYSTEMS PRODUCT DESIGNER</div>
      </div>

      <div style={{ position: "absolute", left: 64, top: 150, width: 650, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.02, letterSpacing: -3.5, fontWeight: 700 }}>
          Complex enterprise products, made clear.
        </div>
        <div style={{ display: "flex", width: 510, marginTop: 30, color: "#5e6064", fontSize: 20, lineHeight: 1.5 }}>
          I design connected workflows, roles, business rules and data-heavy interfaces.
        </div>
      </div>

      <div style={{ position: "absolute", left: 806, top: 237, width: 210, height: 210, border: "1px solid #c9cac5", borderRadius: 105, display: "flex" }} />
      <div style={{ position: "absolute", left: 856, top: 287, width: 110, height: 110, borderRadius: 55, background: "#3155e7", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>
        CLARITY
      </div>
      {nodes.map((node) => (
        <div
          key={node.label}
          style={{
            position: "absolute",
            left: node.left,
            top: node.top,
            width: 140,
            height: 62,
            border: "1px solid #c9cac5",
            borderRadius: 31,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3155e7",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {node.label}
        </div>
      ))}

      <div style={{ position: "absolute", left: 64, right: 64, bottom: 56, height: 1, background: "#d4d5d0", display: "flex" }} />
      <div style={{ position: "absolute", left: 64, bottom: 25, display: "flex", color: "#6d6f73", fontSize: 13 }}>
        Enterprise UX · Workflow architecture · Product UI
      </div>
      <div style={{ position: "absolute", right: 64, bottom: 25, display: "flex", color: "#3155e7", fontSize: 13, fontWeight: 700 }}>
        varunjdesigns.vercel.app
      </div>
    </div>,
    size,
  );
}
