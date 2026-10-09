import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
const client = generateClient<Schema>();
type Report = {
  id: string;
  type: string;
  location: string;
  details: string;
};
function App() {
const [reports, setReports] = useState<Report[]>([]);
const [loading, setLoading] = useState(true);
  const [type, setType] = useState("Water shortage");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const totalReports = reports.length;

const shortageReports = reports.filter(
  (report) => report.type === "Water shortage"
).length;

const leakageReports = reports.filter(
  (report) => report.type === "Water leakage"
).length;
  const qualityReports = reports.filter(
  (report) => report.type === "Suspected water contamination"
).length;

const floodingReports = reports.filter(
  (report) => report.type === "Flooding"
).length;

const otherReports = reports.filter(
  (report) => report.type === "Other water problem"
).length;
  useEffect(() => {
  const subscription = client.models.WaterReport.observeQuery().subscribe({
    next: ({ items }) => {
      setReports(
        items.map((item) => ({
          id: item.id,
          type: item.problemType,
          location: item.area,
          details: item.description,
        }))
      );
      setLoading(false);
    },
    error: (error) => {
      console.error("Error loading reports:", error);
      setLoading(false);
    },
  });

  return () => subscription.unsubscribe();
}, []);

  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#f0fdfa",
      color: "#163b45",
      fontFamily: "Arial, sans-serif",
      padding: "24px",
      boxSizing: "border-box",
    },
    card: {
      background: "white",
      borderRadius: "16px",
      padding: "22px",
      boxShadow: "0 4px 18px #164e6310",
      marginBottom: "20px",
    },
    button: {
      background: "#087f8c",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "9px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    field: {
      display: "block",
      width: "100%",
      padding: "12px",
      margin: "8px 0 16px",
      border: "1px solid #cbdedc",
      borderRadius: "8px",
      boxSizing: "border-box",
      background: "white",
      color: "#163b45",
    },
  };

async function submitReport(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setMessage("Submitting report...");

  try {
    const { errors } = await client.models.WaterReport.create({
      problemType: type,
      area: location.trim(),
      description: details.trim(),
    });

    if (errors?.length) {
      throw new Error("Could not save the report.");
    }

    setLocation("");
    setDetails("");
    setMessage("Your report was saved successfully!");
  } catch (error) {
    console.error(error);
    setMessage("Could not save the report. Please try again.");
  }
}

  return (
    <main style={styles.page}>
      <section style={styles.card}>
  <h2>📊 Water Issue Analytics</h2>
  <p>Live summary of community reports</p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "12px",
    }}
  >
    {[
      { label: "Total Reports", count: totalReports, icon: "📋" },
      { label: "Water Shortages", count: shortageReports, icon: "🚱" },
      { label: "Water Leaks", count: leakageReports, icon: "🔧" },
      { label: "Water Quality", count: qualityReports, icon: "💧" },
      { label: "Flooding", count: floodingReports, icon: "🌧️" },
      { label: "Other Issues", count: otherReports, icon: "📍" },
    ].map((item) => (
      <div
        key={item.label}
        style={{
          background: "#f0f9ff",
          border: "1px solid #dbeafe",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "24px" }}>{item.icon}</div>
        <h3 style={{ fontSize: "28px", margin: "8px 0" }}>
          {loading ? "—" : item.count}
        </h3>
        <p style={{ fontSize: "13px", margin: 0 }}>{item.label}</p>
      </div>
    ))}
  </div>
</section>
      <header
        style={{
          ...styles.card,
          background: "#075e68",
          color: "white",
          padding: "30px",
        }}
      >
        <div style={{ fontSize: "42px" }}>💧</div>
        <h1 style={{ marginBottom: "8px" }}>AquaAlert</h1>
        <p style={{ lineHeight: 1.6 }}>
          Every drop matters. Report water problems, spread awareness,
          and help your community protect its water.
        </p>
        <span>🌍 Water Awareness & Community Action</span>
      </header>

      <section style={styles.card}>
        <h2>🌊 Welcome to AquaAlert</h2>
        <p>
          A community platform for reporting water shortages,
          suspected contamination, and other water-related problems.
        </p>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Demo version: live sensor data and verified local alerts
          are not connected yet.
        </p>
      </section>

      <section style={styles.card}>
        <h2>🚨 Water Problem Reporting</h2>
        <p>Notice a water problem? Submit a report below.</p>

        <form onSubmit={submitReport}>
          <label htmlFor="problem">Problem type</label>
          <select
            id="problem"
            value={type}
            onChange={(event) => setType(event.target.value)}
            style={styles.field}
          >
            <option>Water shortage</option>
            <option>Suspected water contamination</option>
            <option>Water leakage</option>
            <option>Flooding</option>
            <option>Other water problem</option>
          </select>

          <label htmlFor="location">Area or location</label>
          <input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter your area"
            required
            style={styles.field}
          />

          <label htmlFor="details">Describe the problem</label>
          <textarea
            id="details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Tell us what you noticed..."
            required
            rows={4}
            style={styles.field}
          />

          <button type="submit" style={styles.button}>
            Submit Report
          </button>
        </form>

        {message && (
          <p role="status" style={{ color: "#087f8c" }}>
            {message}
          </p>
        )}
      </section>

      <section style={styles.card}>
        <h2>📋 Community Reports</h2>
<p>Saved community reports: {reports.length}</p>
        {loading ? (
  <p>Loading reports...</p>
) : reports.length === 0 ? (
  <p>No reports submitted yet. Be the first to contribute!</p>
) : (
  reports.map((report) => (
    <article
      key={report.id}
      style={{
        border: "1px solid #d8e9e7",
        borderRadius: "10px",
        padding: "14px",
        marginTop: "12px",
      }}
    >
      <h3>{report.type}</h3>
      <p>📍 {report.location}</p>
      <p>{report.details}</p>
      <small>Community-submitted report</small>
    </article>
  ))
)}
      </section>

      <section style={styles.card}>
        <h2>💡 Smart Water-Saving Tips</h2>

        {[
          "Fix leaking taps and pipes promptly.",
          "Turn off taps when brushing your teeth.",
          "Reuse suitable household water for plants.",
          "Collect rainwater where permitted and safe.",
          "Report suspected contamination to local water authorities.",
        ].map((tip, index) => (
          <p key={index} style={{ lineHeight: 1.7 }}>
            ✅ {tip}
          </p>
        ))}
      </section>

      <footer style={{ textAlign: "center", padding: "20px" }}>
        <p>💙 AquaAlert — Every Drop Counts.</p>
        <small>Built for Environmental Hacks using AWS Amplify.</small>
      </footer>
    </main>
  );
}

export default App;
