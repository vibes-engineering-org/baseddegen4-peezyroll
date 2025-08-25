import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient with dice game theme - deep red to dark green */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #DC2626 0%, #059669 100%)",
            opacity: 0.9,
          }}
        />

        {/* Subtle pattern overlay for depth - dice dots pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 30%)",
          }}
        />

        {/* Main content container - centered in safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* User avatar with glow effect */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "48px",
              position: "relative",
            }}
          >
            {/* Glow effect */}
            <div
              style={{
                position: "absolute",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            {/* Avatar container */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "6px solid rgba(255, 255, 255, 0.95)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROJECT_AVATAR_URL}
                alt="User avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Dice elements */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            {/* Die 1 */}
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#ffffff",
                border: "3px solid #000000",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                transform: "rotate(-15deg)",
              }}
            >
              {/* Six dots for dice face */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  width: "40px",
                  height: "40px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                </div>
              </div>
            </div>

            {/* Die 2 */}
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#ffffff",
                border: "3px solid #000000",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                transform: "rotate(15deg)",
              }}
            >
              {/* Five dots for dice face */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  width: "40px",
                  height: "40px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                  <div style={{ width: "8px", height: "8px", backgroundColor: "#000000", borderRadius: "50%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Project title with high contrast */}
          <h1
            style={{
              fontSize: PROJECT_TITLE.length > 25 ? "65px" : "72px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "40px",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              textShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
              maxWidth: "1100px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              whiteSpace: PROJECT_TITLE.length > 40 ? "normal" : "nowrap",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description */}
          <p
            style={{
              fontSize: "36px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.95)",
              textAlign: "center",
              marginBottom: "56px",
              lineHeight: 1.3,
              textShadow: "0 3px 12px rgba(0, 0, 0, 0.4)",
              maxWidth: "800px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Gaming theme branding element */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px 40px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "100px",
              border: "3px solid rgba(255, 215, 0, 0.6)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Chip/token icon */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#FFD700",
                border: "3px solid #B8860B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "900",
                  color: "#8B4513",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                $
              </div>
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Street Craps Game
            </span>
          </div>
        </div>

        {/* Bottom gradient fade for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
