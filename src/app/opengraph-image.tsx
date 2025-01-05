import { ImageResponse } from "next/og";
import SocialImageContent from "./components/SocialImageContent";

export const runtime = "edge";
export const alt = "Hemant Singh Yadav - Software Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgb(17, 24, 39), rgb(3, 7, 18))",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(88, 28, 135, 0.2), transparent, transparent)",
          }}
        />
        <div style={{ padding: "48px" }}>
          <SocialImageContent />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
