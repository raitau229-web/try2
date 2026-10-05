import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { TabBar } from "./components/layout/TabBar";
import { TripListPage } from "./components/trip/TripListPage";
import { CreateTripPage } from "./components/trip/CreateTripPage";
import { TripDetailPage } from "./components/trip/TripDetailPage";
import { SettingsPage } from "./components/settings/SettingsPage";
import { LoginPage } from "./components/auth/LoginPage";
import { DiscoverPage } from "./components/discover/DiscoverPage";
import { SharedTripDetailPage } from "./components/discover/SharedTripDetailPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<TripListPage />} />
          <Route path="/new" element={<CreateTripPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/discover/:sharedId" element={<SharedTripDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}
