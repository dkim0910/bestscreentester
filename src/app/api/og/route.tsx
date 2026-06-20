import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? SITE_NAME).slice(0, 100);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0b0f 0%, #14161c 100%)",
          color: "#e8eaed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, color: "#5b9dff", marginBottom: 24 }}>{`🖥️ ${SITE_NAME}`}</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#9aa0a6", marginTop: 24 }}>
          {"Free online screen tests · no install"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
