-- DROP DATABASE IF EXISTS week6Db;
CREATE DATABASE week6Db;
USE week6Db;

CREATE TABLE journalists (
  journalistid INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT
);

CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  journalistid INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(50),
  FOREIGN KEY (journalistid) REFERENCES journalists(journalistid)
);

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

ALTER TABLE articles
  DROP COLUMN category,
  ADD COLUMN categoryid INT,
  ADD CONSTRAINT fk_articles_categoryid
    FOREIGN KEY (categoryid)
    REFERENCES categories(id);

-- Insert sample journalists
INSERT INTO journalists (name, email, bio) VALUES
('Alexei Ivanov', 'alexei.ivanov@example.ru', 'A tech journalist with over 10 years of experience in AI and innovation.'),
('Maria Petrova', 'maria.petrova@example.ru', 'Maria writes about education, learning technology, and digital tools.'),
('Dmitry Sokolov', 'd.sokolov@example.ru', 'Specialist in science communication and data journalism.');

-- First, make sure categories exist
INSERT INTO categories (name) VALUES ('Education'), ('Technology');

-- Then insert articles with categoryid instead of category name
INSERT INTO articles (journalistid, title, content, categoryid) VALUES
(1, 'Learn with AI', 'Learn with AI is a modern learning platform...', 1), -- Education
(2, 'AI Tools in Modern Classrooms', 'Modern classrooms are increasingly integrating AI tools...', 1),
(3, 'The Rise of AI Journalism', 'Artificial intelligence is not just a topic...', 2), -- Technology
(1, 'Smart Learning Trends in 2025', 'New smart learning platforms are being developed...', 2),
(2, 'Gamification in E-Learning', 'Gamification can boost motivation...', 1);

SELECT 
                a.id, a.title, a.content, a.category,
                j.journalistid, j.name AS journalist, j.email AS journalist_email
            FROM articles a
            JOIN journalists j ON a.journalistid = j.journalistid
            WHERE a.journalistid = 1;
            
SELECT 
  a.id, a.title, c.name AS category
FROM articles a
LEFT JOIN categories c ON a.categoryid = c.id;
