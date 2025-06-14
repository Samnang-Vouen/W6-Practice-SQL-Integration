import * as articleRepository from "../repositories/sqlArticleRepository.js";

// TODO : Change articleRepository to use the sqlArticleRepository

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await articleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await articleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await articleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await articleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    await articleRepository.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/journalists/:id/articles
export async function getArticlesByJournalist(req, res) {
  try {
    const journalistId = req.params.id;
    const articles = await articleRepository.getArticlesByJournalistId(journalistId);

    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found for this journalist" });
    }

    const journalistInfo = {
      journalistid: articles[0].journalistid,
      name: articles[0].journalist_name,
      email: articles[0].journalist_email,
    };

    const articleList = articles.map(({ id, title, content, category }) => ({
      id,
      title,
      content,
      category,
    }));

    res.json({
      journalist: journalistInfo,
      articles: articleList,
    });
  } catch (error) {
    console.error("Error fetching articles by journalist:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//get all categories
export async function getCategories(req, res) {
  try {
    const categories = await articleRepository.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get articles by category ID
export async function getArticlesByCategoryId(req, res) {
  try {
    const categoryId = req.params.id;
    const articles = await articleRepository.getArticlesByCategoryId(categoryId);

    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found for this category" });
    }

    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by category ID:", error);
    res.status(500).json({ message: "Server error" });
  }
}
