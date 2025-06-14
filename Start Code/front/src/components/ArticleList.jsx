import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getArticles, getArticlesByCategoryId, removeArticle, getCategories } from "../services/api";

// ArticleList component
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [articlesData, categoriesData] = await Promise.all([getArticles(), getCategories()]);
        setArticles(articlesData);
        setCategories(categoriesData); // Store full category objects with id and name
      } catch (err) {
        setError("Failed to load initial data. Please check your connection or try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchArticlesByCategories = async (categoryIds = []) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = categoryIds.length > 0
        ? await Promise.all(categoryIds.map(id => getArticlesByCategoryId(id)))
          .then(results => results.flat())
        : await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    const updatedCategoryIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    setSelectedCategoryIds(updatedCategoryIds);
    fetchArticlesByCategories(updatedCategoryIds);
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await removeArticle(id);
      await fetchArticlesByCategories(selectedCategoryIds);
    } catch (err) {
      setError("Failed to delete article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);
  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onEdit={handleEdit}
            onDelete={deleteArticle}
            onView={handleView}
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryClick={handleCategoryClick}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete, categories, selectedCategoryIds, onCategoryClick }) {

  return (
    <div className="article-card">
      <h3 className="article-title">
        <Link to={`/articles/${article.id}`} className="link">
          {article.title}
        </Link>
      </h3>

      <p className="article-author">
        By {' '}
        <Link to={`/journalists/${article.journalistid}/articles`} className="link">
          {article.journalist || 'Unknown'}
        </Link>
      </p>

      <p className="article-snippet">
        {article.content && article.content.length > 80 ? article.content.slice(0, 80) + "..." : article.content || 'No content available'}
      </p>

      {/* <div className="article-tags">
        {category && (
          <span className="tag-badge">
            {category.name}
          </span>
        )}
      </div> */}

      <div className="article-actions">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`button-tertiary ${selectedCategoryIds.includes(category.id) ? 'active' : ''}`}
            onClick={() => onCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
        <button className="button-secondary" onClick={() => onView(article.id)}>
          VIEW
        </button>
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button className="button-tertiary" onClick={() => onDelete(article.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}