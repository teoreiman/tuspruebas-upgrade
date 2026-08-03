import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: "" };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error de renderizado:", error, info.componentStack);
    this.setState({ info: info.componentStack ?? "" });
  }

  render() {
    if (!this.state.error) return this.props.children;

    const detalle = `${this.state.error.name}: ${this.state.error.message}\n${this.state.info}`;

    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#070b14", color: "#fff",
        fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center", gap: "16px",
      }}>
        <h1 style={{ fontSize: "20px", fontWeight: 900 }}>Se rompió algo en esta pantalla</h1>
        <p style={{ fontSize: "14px", color: "#8A8A9A", maxWidth: "560px" }}>
          Copiá el texto de abajo y pasámelo para que pueda arreglarlo.
        </p>
        <pre style={{
          maxWidth: "720px", width: "100%", textAlign: "left", whiteSpace: "pre-wrap", wordBreak: "break-word",
          backgroundColor: "#0d1526", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "10px",
          padding: "16px", fontSize: "12px", color: "#f87171", overflow: "auto", maxHeight: "40vh",
        }}>
          {detalle}
        </pre>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigator.clipboard?.writeText(detalle)}
            style={{ backgroundColor: "#1063EF", color: "#fff", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "9px", border: "none", cursor: "pointer" }}
          >
            Copiar error
          </button>
          <button
            onClick={() => (window.location.href = "/home")}
            style={{ backgroundColor: "transparent", color: "#8A8A9A", fontWeight: 600, fontSize: "13px", padding: "10px 20px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
}
