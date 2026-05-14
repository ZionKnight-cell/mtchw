import { useState } from "react";
import "./styles/app.css";

type Screen = "home" | "saved" | "history" | "settings";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <header className="app-header">
          <p className="eyebrow">boredom button</p>
          <h1>mtchw</h1>
          <p className="tagline">One tiny thing to do when you’re bored.</p>
        </header>

        <section className="screen-content">
          {currentScreen === "home" && <HomeScreen />}
          {currentScreen === "saved" && <PlaceholderScreen title="Saved" />}
          {currentScreen === "history" && <PlaceholderScreen title="History" />}
          {currentScreen === "settings" && <PlaceholderScreen title="Settings" />}
        </section>

        <nav className="bottom-nav" aria-label="Main navigation">
          <button
            className={currentScreen === "home" ? "active" : ""}
            onClick={() => setCurrentScreen("home")}
          >
            Home
          </button>

          <button
            className={currentScreen === "saved" ? "active" : ""}
            onClick={() => setCurrentScreen("saved")}
          >
            Saved
          </button>

          <button
            className={currentScreen === "history" ? "active" : ""}
            onClick={() => setCurrentScreen("history")}
          >
            History
          </button>

          <button
            className={currentScreen === "settings" ? "active" : ""}
            onClick={() => setCurrentScreen("settings")}
          >
            Settings
          </button>
        </nav>
      </section>
    </main>
  );
}

function HomeScreen() {
  return (
    <div className="home-screen">
      <div className="hero-card">
        <h2>I’m bored.</h2>
        <p>
          Tap the button and mtchw will give you one small thing to do. No feed,
          no pressure, no productivity guilt.
        </p>

        <button className="primary-button">I’m bored</button>
        <button className="secondary-button">Surprise me</button>
      </div>

      <div className="tiny-note">
        MVP status: app shell created. Activity suggestions come next.
      </div>
    </div>
  );
}

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="placeholder-screen">
      <h2>{title}</h2>
      <p>This screen will be built in a later step.</p>
    </div>
  );
}

export default App;