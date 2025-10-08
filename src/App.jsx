import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "./App.css";

export default function App() {
  const [time, setTime] = useState(0); // waktu dalam ms
  const [running, setRunning] = useState(false);
  const requestRef = useRef(null);
  const endTimeRef = useRef(0);

  const [inputHours, setInputHours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);

  // Format waktu tampil
  const formatTime = (ms) => {
    const totalMs = Math.max(0, Math.floor(ms));
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = totalMs % 1000;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(
      3,
      "0"
    )}`;
  };

  // Loop countdown
  const update = () => {
    const remaining = endTimeRef.current - performance.now();
    if (remaining <= 0) {
      setTime(0);
      setRunning(false);
      cancelAnimationFrame(requestRef.current);

      Swal.fire({
        title: "⏰ Waktu Habis!",
        text: "Timer kamu sudah selesai!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      return;
    }
    setTime(remaining);
    requestRef.current = requestAnimationFrame(update);
  };

  // Mulai countdown
  const handleStart = () => {
    const totalMs =
      (Number(inputHours) * 3600 +
        Number(inputMinutes) * 60 +
        Number(inputSeconds)) *
      1000;

    if (totalMs <= 0) {
      Swal.fire({
        title: "⚠️ Input tidak valid!",
        text: "Masukkan waktu terlebih dahulu.",
        icon: "warning",
        confirmButtonColor: "#f8bb86",
      });
      return;
    }

    setTime(totalMs);
    setRunning(true);
    endTimeRef.current = performance.now() + totalMs;
    requestRef.current = requestAnimationFrame(update);
  };

  // Hentikan sementara
  const handleStop = () => {
    cancelAnimationFrame(requestRef.current);
    setRunning(false);

    Swal.fire({
      title: "⏸️ Dijeda",
      text: "Timer dihentikan sementara.",
      icon: "info",
      timer: 1200,
      showConfirmButton: false,
      background: "#f0f9ff",
    });
  };

  // Lanjutkan dari waktu terakhir
  const handleResume = () => {
    setRunning(true);
    endTimeRef.current = performance.now() + time;
    requestRef.current = requestAnimationFrame(update);
  };

  // Reset
  const handleReset = () => {
    cancelAnimationFrame(requestRef.current);
    setTime(0);
    setRunning(false);
    setInputHours(0);
    setInputMinutes(0);
    setInputSeconds(0);

    Swal.fire({
      title: "🔁 Reset",
      text: "Timer telah direset.",
      icon: "info",
      timer: 1000,
      showConfirmButton: false,
      background: "#f9f9f9",
    });
  };

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h3>Countdown Timer (Post Test)</h3>

        <div className="inputs">
          <input
            type="number"
            min="0"
            value={inputHours}
            onChange={(e) => setInputHours(e.target.value)}
            placeholder="Jam"
          />
          <input
            type="number"
            min="0"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            placeholder="Menit"
          />
          <input
            type="number"
            min="0"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(e.target.value)}
            placeholder="Detik"
          />
        </div>

        <div className="time">{formatTime(time)}</div>

        <div className="controls">
          {!running && time === 0 && (
            <button onClick={handleStart} className="start">
              Mulai
            </button>
          )}
          {running && (
            <button onClick={handleStop} className="stop">
              Stop
            </button>
          )}
          {!running && time > 0 && (
            <button onClick={handleResume} className="resume">
              Lanjut
            </button>
          )}
          <button onClick={handleReset} className="reset">
            Reset
          </button>
        </div>

        <p className="note">
          Masukkan jam, menit, dan detik, lalu tekan <strong>Mulai</strong>{" "}
          untuk memulai hitungan mundur.
        </p>
      </div>
    </div>
  );
}
