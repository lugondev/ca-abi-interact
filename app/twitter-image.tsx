import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Contract ABI Interact - Interact with Smart Contracts";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Contract ABI Interact
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a0a0a0",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: "1.5",
            }}
          >
            Interact with smart contracts across multiple blockchain networks
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "48px",
              gap: "16px",
              fontSize: "20px",
              color: "#1d9bf0",
            }}
          >
            <div
              style={{
                padding: "12px 24px",
                border: "2px solid #1d9bf0",
                borderRadius: "8px",
              }}
            >
              Deploy
            </div>
            <div
              style={{
                padding: "12px 24px",
                border: "2px solid #1d9bf0",
                borderRadius: "8px",
              }}
            >
              Read
            </div>
            <div
              style={{
                padding: "12px 24px",
                border: "2px solid #1d9bf0",
                borderRadius: "8px",
              }}
            >
              Write
            </div>
            <div
              style={{
                padding: "12px 24px",
                border: "2px solid #1d9bf0",
                borderRadius: "8px",
              }}
            >
              Monitor
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
