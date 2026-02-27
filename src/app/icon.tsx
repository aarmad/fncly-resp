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
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(79,70,229,0.4)",
                }}
            >
                <span
                    style={{
                        color: "white",
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
