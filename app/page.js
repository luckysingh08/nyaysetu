"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

// Balance Scale SVG Logo
function ScaleLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="24" y1="6" x2="24" y2="42" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="42" x2="38" y2="42" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="40" y2="16" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="24" y2="8" stroke="#d4af37" strokeWidth="1" />
      <line x1="40" y1="16" x2="24" y2="8" stroke="#d4af37" strokeWidth="1" />
      <path d="M2 16 Q8 22 14 16" stroke="#d4af37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M34 16 Q40 22 46 16" stroke="#d4af37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="8" r="1.5" fill="#d4af37" />
    </svg>
  );
}

// Loading Spinner
function Spinner() {
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "#d4af37" }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "#d4af37" }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "#d4af37" }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

// Output Card
function OutputCard({ title, content, type }) {
  const borderColor = type === "ask" ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.1)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card p-6 mt-6"
      style={{ borderColor }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: type === "ask" ? "#d4af37" : "#6b7280" }}
        />
        <h3
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: type === "ask" ? "#d4af37" : "#9ca3af" }}
        >
          {title}
        </h3>
      </div>
      <div
        className="text-sm leading-relaxed prose prose-invert max-w-none"
        style={{ color: "#e5e7eb" }}
      >
        <ReactMarkdown
          components={{
            h3: ({ children }) => (
              <h3 style={{ color: "#d4af37", fontWeight: "700", fontSize: "0.95rem", marginTop: "1.2rem", marginBottom: "0.4rem", letterSpacing: "0.02em" }}>
                {children}
              </h3>
            ),
            h2: ({ children }) => (
              <h2 style={{ color: "#d4af37", fontWeight: "700", fontSize: "1rem", marginTop: "1.2rem", marginBottom: "0.4rem" }}>
                {children}
              </h2>
            ),
            strong: ({ children }) => (
              <strong style={{ color: "#ffffff", fontWeight: "700" }}>
                {children}
              </strong>
            ),
            p: ({ children }) => (
              <p style={{ marginBottom: "0.75rem", lineHeight: "1.8", color: "#e5e7eb" }}>
                {children}
              </p>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: "0.4rem", color: "#e5e7eb", lineHeight: "1.7" }}>
                {children}
              </li>
            ),
            ul: ({ children }) => (
              <ul style={{ paddingLeft: "1.2rem", marginBottom: "0.75rem" }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ paddingLeft: "1.2rem", marginBottom: "0.75rem" }}>
                {children}
              </ol>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [askResult, setAskResult] = useState("");
  const [complaintResult, setComplaintResult] = useState("");
  const [error, setError] = useState("");

  const MAX_LENGTH = 1000;

  async function handleAsk() {
    if (!query.trim()) {
      setError("Please describe your legal issue first.");
      return;
    }
    setError("");
    setAskLoading(true);
    setAskResult("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAskResult(data.result);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setAskLoading(false);
  }

  async function handleComplaint() {
    if (!query.trim()) {
      setError("Please describe your legal issue first.");
      return;
    }
    setError("");
    setComplaintLoading(true);
    setComplaintResult("");
    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setComplaintResult(data.result);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setComplaintLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-10"
      >
        <ScaleLogo />
        <h1
          className="font-playfair text-4xl md:text-5xl font-bold mt-4 gold-text"
        >
          NyaySetu
        </h1>
        <p className="text-sm mt-2 tracking-widest uppercase" style={{ color: "#9ca3af" }}>
          Your Legal AI Assistant
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        {/* Privacy Notice */}
        <div
          className="text-xs mb-4 px-4 py-3 rounded-lg"
          style={{
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.15)",
            color: "#9ca3af",
          }}
        >
          🔒 Do not enter passwords, OTPs, Aadhaar numbers, or full bank details.
        </div>

        {/* Textarea */}
        <div className="glass-card p-1">
          <textarea
            rows={5}
            maxLength={MAX_LENGTH}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your legal situation in simple words...

Example: A traffic police officer stopped me and took my vehicle keys without giving any receipt. What are my rights?"
            className="w-full bg-transparent px-4 py-4 text-sm rounded-xl"
            style={{
              color: "#f0f0f0",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              lineHeight: "1.7",
            }}
          />
        </div>

        {/* Character count */}
        <div className="text-right mt-1 text-xs" style={{ color: "#4b5563" }}>
          {query.length}/{MAX_LENGTH}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAsk}
            disabled={askLoading || complaintLoading}
            className="btn-gold flex-1 py-4 px-6 rounded-xl text-sm tracking-wide"
          >
            {askLoading ? <Spinner /> : "⚖️ Ask AI — Know Your Rights"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplaint}
            disabled={askLoading || complaintLoading}
            className="btn-dark flex-1 py-4 px-6 rounded-xl text-sm tracking-wide"
          >
            {complaintLoading ? <Spinner /> : "📝 Generate Complaint Draft"}
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm px-4 py-3 rounded-lg"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ask Result */}
        <AnimatePresence>
          {askResult && (
            <OutputCard
              title="Legal Guidance — NyaySetu AI"
              content={askResult}
              type="ask"
            />
          )}
        </AnimatePresence>

        {/* Complaint Result */}
        <AnimatePresence>
          {complaintResult && (
            <OutputCard
              title="Complaint Draft — NyaySetu AI"
              content={complaintResult}
              type="complaint"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Disclaimer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 max-w-2xl text-center"
      >
        <div
          className="text-xs px-6 py-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#6b7280",
            lineHeight: "1.8",
          }}
        >
          <span style={{ color: "#d4af37" }}>⚖️ Legal Disclaimer</span>
          <br />
          NyaySetu provides general legal information only. It is not a substitute
          for advice from a qualified lawyer. Do not make important legal decisions
          based solely on this information. For urgent matters involving arrest,
          criminal charges, court deadlines, or serious financial loss — consult a
          lawyer or your nearest Legal Services Authority immediately.
        </div>
        <p className="mt-4 text-xs" style={{ color: "#374151" }}>
          © 2025 NyaySetu. Built for every Indian citizen.
        </p>
      </motion.footer>
    </main>
  );
}