import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChatPage } from "./pages/ChatPage";
import { AuthRoutes } from "./pages/AuthRoutes";
import { SignUpPage } from "./pages/SignUpPage";
import { Dashboard } from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./pages/AuthProvider";
import { LogInPage } from "./pages/LogInPage";
import { JournalPage } from "./pages/JournalPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/log-in" element={<LogInPage />} />

          <Route path="/app" element={<AuthRoutes />}>
            <Route path="*" element={<Dashboard />}>
              <Route path={"chat"} element={<ChatPage />} />
              <Route path={"journal"} element={<JournalPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
