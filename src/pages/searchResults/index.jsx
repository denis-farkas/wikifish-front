import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EspeceCard from "../../components/especeCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(
          `${API_URL}/espece/search?q=${encodeURIComponent(query)}`
        );
        setResults(response.data.especes || []);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        toast.error("Erreur lors de la recherche d'espèces");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container py-4">
      <h1>
        Résultats de recherche pour :{" "}
        <span className="text-primary">"{query}"</span>
      </h1>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-muted">
              {results.length} résultat(s) trouvé(s)
            </span>
          </div>

          {results.length === 0 ? (
            <div className="alert alert-info">
              Aucun résultat trouvé pour "{query}".
              <Link to="/" className="alert-link ms-2">
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {results.map((espece) => (
                <div className="col" key={espece.id_espece}>
                  <EspeceCard espece={espece} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
