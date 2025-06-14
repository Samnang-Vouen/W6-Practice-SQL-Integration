//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import { pool } from "../utils/database.js";

// Get all articles
export async function getArticles() {
    // TODO
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.id, a.title, a.content, a.journalistid,
                j.name AS journalist, j.email AS journalist_email
            FROM articles a
            JOIN journalists j ON a.journalistid = j.journalistid
            LEFT JOIN categories c ON a.categoryid = c.id
        `);
        console.log("Fetched articles:", rows);
        return rows;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Could not fetch articles");
    }
}


// Get one article by ID
export async function getArticleById(id) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id, a.title, a.content, a.journalistid,
        j.name AS journalist, j.email AS journalist_email,
        c.name AS category
      FROM articles a
      JOIN journalists j ON a.journalistid = j.journalistid
      LEFT JOIN categories c ON a.categoryid = c.id
      WHERE a.id = ?
    `, [id]);

    if (rows.length === 0) {
      throw new Error(`Article with ID ${id} not found`);
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    throw new Error("Could not fetch article");
  }
}

// Create a new article
export async function createArticle(article) {
    // TODO
    const { title, content, journalistid, categoryid } = article;

    try {
        const [result] = await pool.query(
            "INSERT INTO articles (title, content, journalistid, categoryid) VALUES (?, ?, ?, ?)",
            [title, content, journalistid, categoryid]

        );
        return { id: result.insertId, ...article };
    } catch (error) {
        console.error("Error creating article:", error);
        throw new Error("Could not create article");
    }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    const { title, content, journalistid, categoryid } = updatedData;
    try {
        const [result] = await pool.query(
            "UPDATE articles SET title = ?, content = ?, journalistid = ?, categoryid = ? WHERE id = ?",
            [title, content, journalistid, categoryid, id]

        );
        if (result.affectedRows === 0) {
            throw new Error(`Article with ID ${id} not found`);
        }
        return { id, ...updatedData };
    } catch (error) {
        console.error("Error updating article:", error);
        throw new Error("Could not update article");
    }
}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    try {
        const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            throw new Error(`Article with ID ${id} not found`);
        }
        return { message: "Article deleted successfully" };
    } catch (error) {
        console.error("Error deleting article:", error);
        throw new Error("Could not delete article");
    }

}

export async function getArticlesByJournalistName(name) {
    try {
        const [rows] = await pool.query(`
            SELECT 
            a.id, a.title, a.content,
            j.journalistid, j.name AS journalist_name, j.email AS journalist_email,
            c.name AS category
            FROM articles a
            JOIN journalists j ON a.journalistid = j.journalistid
            LEFT JOIN categories c ON a.categoryid = c.id
            WHERE a.journalistid = ?
        `, [name]);
        return rows;
    } catch (error) {
        console.error("Error fetching articles by journalist name:", error);
        throw new Error("Could not fetch articles");
    }
}

export async function getArticlesByJournalistId(journalistId) {
    try {
        const [rows] = await pool.query(`
            SELECT 
            a.id, a.title, a.content,
            j.journalistid, j.name AS journalist_name, j.email AS journalist_email,
            c.name AS category
            FROM articles a
            JOIN journalists j ON a.journalistid = j.journalistid
            LEFT JOIN categories c ON a.categoryid = c.id
            WHERE a.journalistid = ?
        `, [journalistId]);

        return rows;
    } catch (error) {
        console.error("Error fetching articles by journalist ID:", error);
        throw new Error("Could not fetch articles for journalist");
    }
}

// get all categories
export async function getCategories() {
    try {
        const [rows] = await pool.query("SELECT * FROM categories");
        return rows;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Could not fetch categories");
    }
}

// Get articles by category ID
export async function getArticlesByCategoryId(categoryId) {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, c.name AS category
            FROM articles a
            JOIN categories c ON a.categoryid = c.id
            WHERE c.id = ?
        `, [categoryId]);

        return rows;
    } catch (error) {
        console.error("Error fetching articles by category ID:", error);
        throw new Error("Could not fetch articles for category");
    }
}


