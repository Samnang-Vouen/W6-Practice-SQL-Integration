CREATE DATABASE week6Db;
USE week6Db;

CREATE TABLE articles(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    title VARCHAR(225),
    content TEXT,
    journalist VARCHAR(100),
    category VARCHAR(50)
);