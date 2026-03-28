import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  useEffect(() => {
    window.location.href = "https://frc10042.com";
  }, []);

  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta
          name="description"
          content="Spirit Dynamics API - Redirecting to main site"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="refresh" content="0; url=https://frc10042.com" />
      </Head>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#0a0a0a",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>
            🔄 Yönlendiriliyor...
          </h1>
          <p style={{ color: "#888" }}>
            <a
              href="https://frc10042.com"
              style={{ color: "#dbad07", textDecoration: "none" }}
            >
              frc10042.com
            </a>{" "}
            adresine yönlendiriliyorsunuz
          </p>
        </div>
      </div>
    </>
  );
}
