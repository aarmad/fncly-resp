import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 64,
                    height: 64,
                    background: "#000",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #333",
                }}
            >
                <span
                    style={{
                        color: "#f5f5f5",
                        fontSize: 32,
                        fontWeight: 900,
                        letterSpacing: "-1px",
                        fontFamily: "sans-serif",
                        lineHeight: 1,
                    }}
                >
                    F.
                </span>
            </div>
        ),
        { ...size }
    );
}
