import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/Home";
import BackOffice from "./pages/backOffice";
import BackUser from "./pages/backUser";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import UserProfile from "./pages/userProfile";
import Especes from "./pages/especes";

import BackCommentaire from "./pages/backCommentaire";
import BackCommentaireUpdate from "./pages/backCommentaire/update";

import CommentaireCreate from "./pages/commentaire/create";
import CommentaireUpdate from "./pages/commentaire/update";

import BackContribution from "./pages/backContribution";
import Contribution from "./pages/contribution";
import EditContribution from "./pages/contribution/update";
import BackContributionView from "./pages/backContribution/view";

import BackEspece from "./pages/backEspece";
import BackEspeceCreate from "./pages/backEspece/create";
import BackEspeceUpdate from "./pages/backEspece/update";

import BackFamille from "./pages/backFamille";
import BackFamilleCreate from "./pages/backFamille/create";
import BackFamilleUpdate from "./pages/backFamille/update";

import BackHabitat from "./pages/backHabitat";
import BackHabitatCreate from "./pages/backHabitat/create";
import BackHabitatUpdate from "./pages/backHabitat/update";

import BackTemperament from "./pages/backTemperament";
import BackTemperamentCreate from "./pages/backTemperament/create";
import BackTemperamentUpdate from "./pages/backTemperament/update";

import Espece from "./pages/espece";
import SearchResults from "./pages/searchResults";
import SearchHistory from "./pages/searchHistory";
import ProtectedRoute from "./components/protectedRoute";

import BackLogs from "./pages/backLogs";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <div className="container">
          <Header />

          <img
            src="/ban.png"
            alt="Bannière"
            className="img-fluid mb-3"
            style={{ width: "100%", height: "auto" }}
          />

          <main className="flex-grow-1">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="/especes" element={<Especes />} />
              <Route
                path="/commentaire/create/:id_espece"
                element={<CommentaireCreate />}
              />
              <Route
                path="/commentaire/update/:id_commentaire"
                element={<CommentaireUpdate />}
              />
              <Route
                path="/contribution/create/:id_espece"
                element={<Contribution />}
              />
              <Route
                path="/contribution/update/:id_contribution"
                element={<EditContribution />}
              />
              <Route path="/espece/readOne/:id_espece" element={<Espece />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/search-history" element={<SearchHistory />} />

              {/* Routes protégées pour admin */}
              <Route
                path="/backOffice"
                element={
                  <ProtectedRoute>
                    <BackOffice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backLogs"
                element={
                  <ProtectedRoute>
                    <BackLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backUser"
                element={
                  <ProtectedRoute>
                    <BackUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backCommentaire"
                element={
                  <ProtectedRoute>
                    <BackCommentaire />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backCommentaire/update/:id_commentaire"
                element={
                  <ProtectedRoute>
                    <BackCommentaireUpdate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backContribution"
                element={
                  <ProtectedRoute>
                    <BackContribution />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backContribution/view/:id_contribution"
                element={
                  <ProtectedRoute>
                    <BackContributionView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backEspece"
                element={
                  <ProtectedRoute>
                    <BackEspece />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backEspece/create"
                element={
                  <ProtectedRoute>
                    <BackEspeceCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backEspece/update/:id_espece"
                element={
                  <ProtectedRoute>
                    <BackEspeceUpdate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backHabitat"
                element={
                  <ProtectedRoute>
                    <BackHabitat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backHabitat/create"
                element={
                  <ProtectedRoute>
                    <BackHabitatCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backHabitat/update/:id_habitat"
                element={
                  <ProtectedRoute>
                    <BackHabitatUpdate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backTemperament"
                element={
                  <ProtectedRoute>
                    <BackTemperament />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backTemperament/create"
                element={
                  <ProtectedRoute>
                    <BackTemperamentCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backTemperament/update/:id_temperament"
                element={
                  <ProtectedRoute>
                    <BackTemperamentUpdate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/backFamille"
                element={
                  <ProtectedRoute>
                    <BackFamille />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backFamille/create"
                element={
                  <ProtectedRoute>
                    <BackFamilleCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backFamille/update/:id_famille"
                element={
                  <ProtectedRoute>
                    <BackFamilleUpdate />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
