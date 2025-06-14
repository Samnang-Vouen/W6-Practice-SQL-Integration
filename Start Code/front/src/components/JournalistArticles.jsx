import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getArticlesByJournalistId } from "../services/api";

export default function JournalistArticles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getArticlesByJournalistId(id);
        setData(result);
      } catch (err) {
        setError("Failed to load journalist data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data || !data.journalist) return <p>No journalist found.</p>;

  const handleView = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <div>
      <h2>{data.journalist.name}</h2>
      <p>Email: {data.journalist.email}</p>

      {data.articles.length === 0 ? (
        <p>This journalist has no articles.</p>
      ) : (
        <div className="article-list">
          {data.articles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-title">{article.title}</div>
              <div className="article-author">By {data.journalist.name} </div>
              <div className="article-actions">
                <button
                  className="button-secondary"
                  onClick={() => handleView(article.id)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}