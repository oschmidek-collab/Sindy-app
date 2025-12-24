"use client";

import React, { useMemo, useState } from "react";

type Mode = "home" | "A" | "B";

async function callRightbot(payload: {
  mode: "A" | "B";
  question?: string;
  answer?: string;
  action?: "answer" | "question";
}) {
  const res = await fetch("/api/rightbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Request failed");
  }

  return (await res.json()) as { answer?: string; question?: string };
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("home");

  // מצב A
  const [aAnswer, setAAnswer] = useState<string>("");
  const [aLoading, setALoading] = useState(false);

  // מצב B
  const [bQuestion, setBQuestion] = useState<string>("טוען שאלה…");
  const [bInput, setBInput] = useState<string>("");
  const [bAnswer, setBAnswer] = useState<string>("");
  const [bLoading, setBLoading] = useState(false);
  const [bQLoading, setBQLoading] = useState(false);

  const bgStyle = useMemo(
    () => ({
      background:
        "radial-gradient(1000px 700px at 15% 15%, rgba(255,230,0,0.25), transparent 55%)," +
        "radial-gradient(900px 650px at 85% 25%, rgba(0,210,255,0.22), transparent 55%)," +
        "radial-gradient(900px 700px at 55% 90%, rgba(255,70,120,0.18), transparent 60%)," +
        "linear-gradient(135deg, #0b0b10 0%, #111118 55%, #0b0b10 100%)",
    }),
    []
  );

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
    boxShadow: "0 20px 70px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  };

  const btnBase: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
  };

  const btnA: React.CSSProperties = {
    ...btnBase,
    background:
      "linear-gradient(135deg, rgba(255,230,0,0.95), rgba(255,155,0,0.92))",
    color: "#111118",
  };

  const btnB: React.CSSProperties = {
    ...btnBase,
    background:
      "linear-gradient(135deg, rgba(0,210,255,0.92), rgba(255,70,120,0.82))",
    color: "#0b0b10",
  };

  const subtleBtn: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, "Noto Sans Hebrew", sans-serif',
    letterSpacing: "-0.02em",
  };

  // פונט אלגנטי לתשובות
  const answerStyle: React.CSSProperties = {
    fontFamily: '"Georgia", "Times New Roman", "Noto Serif Hebrew", serif',
    fontSize: 18,
    lineHeight: 1.85,
    color: "rgba(255,255,255,0.92)",
    whiteSpace: "pre-wrap",
  };

  const fadeIn: React.CSSProperties = {
    animation: "fadeInUp 520ms ease-out both",
  };

  const onRunA = async () => {
    try {
      setALoading(true);
      setAAnswer("");
      const data = await callRightbot({ mode: "A", question: "האם אני צודקת?" });
      setAAnswer(data.answer || "משהו השתבש. נסי שוב.");
    } catch {
      setAAnswer("משהו השתבש. נסי שוב.");
    } finally {
      setALoading(false);
    }
  };

  // ✅ חדש: להביא שאלה רנדומלית למצב B מה-API
  const fetchBQuestion = async () => {
    try {
      setBQLoading(true);
      setBAnswer("");
      setBInput("");
      const data = await callRightbot({ mode: "B", action: "question" });
      setBQuestion((data.question || "תני לי רגע… משהו השתבש, נסי שוב.").trim());
    } catch {
      setBQuestion("משהו השתבש בטעינת השאלה. נסי שוב.");
    } finally {
      setBQLoading(false);
    }
  };

  const onRunB = async () => {
    try {
      setBLoading(true);
      setBAnswer("");
      const data = await callRightbot({
        mode: "B",
        question: bQuestion,
        answer: bInput,
        action: "answer",
      });
      setBAnswer(data.answer || "משהו השתבש. נסי שוב.");
    } catch {
      setBAnswer("משהו השתבש. נסי שוב.");
    } finally {
      setBLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "28px 18px",
        ...bgStyle,
      }}
    >
      <div style={{ width: "min(980px, 100%)", display: "grid", gap: 14 }}>
        {/* Header */}
        <div
          style={{
            ...cardStyle,
            borderRadius: 28,
            padding: "22px 22px",
            ...fadeIn,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
              color: "rgba(255,255,255,0.96)",
              ...titleStyle,
            }}
          >
            מד הצדק של סינדי
          </h1>
        </div>

        {/* Home */}
        {mode === "home" && (
          <div
            style={{
              ...cardStyle,
              borderRadius: 28,
              padding: "22px",
              display: "grid",
              gap: 14,
              ...fadeIn,
            }}
          >
            <div style={{ display: "grid", gap: 10 }}>
              <button
                onClick={() => setMode("A")}
                style={{
                  ...btnA,
                  borderRadius: 18,
                  padding: "16px 16px",
                  fontWeight: 900,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                בדקי את עצמך
              </button>

              <button
                onClick={async () => {
                  setMode("B");
                  await fetchBQuestion();
                }}
                style={{
                  ...btnB,
                  borderRadius: 18,
                  padding: "16px 16px",
                  fontWeight: 900,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
               מד צדק גולבאלי 
              </button>
            </div>
          </div>
        )}

        {/* Mode A */}
        {mode === "A" && (
          <div
            style={{
              ...cardStyle,
              borderRadius: 28,
              padding: "22px",
              display: "grid",
              gap: 14,
              ...fadeIn,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => {
                  setMode("home");
                  setAAnswer("");
                }}
                style={{
                  ...subtleBtn,
                  borderRadius: 14,
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                חזרה
              </button>
              <div style={{ flex: 1 }} />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 900,
                color: "rgba(255,255,255,0.92)",
                ...titleStyle,
              }}
            >
              האם אני צודקת?
            </h2>

            {/* רק פה מופיע המשפט הזה */}
            <div
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 14,
                marginTop: -6,
              }}
            >
              עצמי עיניים ודמייני את השאלה.
            </div>

            <button
              onClick={onRunA}
              disabled={aLoading}
              style={{
                ...btnA,
                borderRadius: 18,
                padding: "14px 16px",
                fontWeight: 900,
                fontSize: 18,
                cursor: aLoading ? "not-allowed" : "pointer",
                opacity: aLoading ? 0.8 : 1,
              }}
            >
              {aLoading ? "בודקים..." : "הפעל"}
            </button>

            {aAnswer && (
              <div
                style={{
                  borderRadius: 22,
                  padding: "18px 18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.18)",
                }}
              >
                <div style={answerStyle}>{aAnswer}</div>
              </div>
            )}
          </div>
        )}

        {/* Mode B */}
        {mode === "B" && (
          <div
            style={{
              ...cardStyle,
              borderRadius: 28,
              padding: "22px",
              display: "grid",
              gap: 14,
              ...fadeIn,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => {
                  setMode("home");
                  setBAnswer("");
                  setBInput("");
                }}
                style={{
                  ...subtleBtn,
                  borderRadius: 14,
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                חזרה
              </button>

              <button
                onClick={fetchBQuestion}
                disabled={bQLoading}
                style={{
                  ...subtleBtn,
                  borderRadius: 14,
                  padding: "10px 12px",
                  cursor: bQLoading ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  opacity: bQLoading ? 0.8 : 1,
                }}
              >
                {bQLoading ? "טוען..." : "שאלה אחרת"}
              </button>

              <div style={{ flex: 1 }} />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 900,
                color: "rgba(255,255,255,0.92)",
                ...titleStyle,
              }}
            >
              בחני את עצמך
            </h2>

            <div
              style={{
                borderRadius: 22,
                padding: "16px 16px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.70)",
                  marginBottom: 8,
                }}
              >
                השאלה:
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.95)",
                  lineHeight: 1.4,
                }}
              >
                {bQuestion}
              </div>
            </div>

            <textarea
              value={bInput}
              onChange={(e) => setBInput(e.target.value)}
              placeholder="כתבי את התשובה שלך כאן..."
              style={{
                width: "100%",
                minHeight: 120,
                resize: "vertical",
                borderRadius: 18,
                padding: "14px 14px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                outline: "none",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            />

            <button
              onClick={onRunB}
              disabled={bLoading}
              style={{
                ...btnB,
                borderRadius: 18,
                padding: "14px 16px",
                fontWeight: 900,
                fontSize: 18,
                cursor: bLoading ? "not-allowed" : "pointer",
                opacity: bLoading ? 0.8 : 1,
              }}
            >
              {bLoading ? "בודקים..." : "בדקי "}
            </button>

            {bAnswer && (
              <div
                style={{
                  borderRadius: 22,
                  padding: "18px 18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.18)",
                }}
              >
                <div style={answerStyle}>{bAnswer}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          60% { opacity: .86; transform: translateY(3px); filter: blur(1px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </main>
  );
}