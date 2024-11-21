-- Sample PostgreSQL DDL Script (Approx. 300+ lines)

-- Table definitions
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id),
    user_id INT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE post_categories (
    post_id INT NOT NULL REFERENCES posts(id),
    category_id INT NOT NULL REFERENCES categories(id),
    PRIMARY KEY (post_id, category_id)
);

-- Index definitions
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_categories_name ON categories(name);

-- View definitions
CREATE VIEW user_posts AS
SELECT u.id AS user_id, u.username, p.id AS post_id, p.title, p.created_at
FROM users u
JOIN posts p ON u.id = p.user_id;

CREATE VIEW post_comments AS
SELECT p.id AS post_id, p.title, c.id AS comment_id, c.content, c.created_at
FROM posts p
JOIN comments c ON p.id = c.post_id;

-- Trigger and Function Definitions
CREATE OR REPLACE FUNCTION update_post_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_timestamp_trigger
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_post_timestamp();

-- Insert sample data into tables
INSERT INTO users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');

INSERT INTO categories (name) VALUES
('Technology'),
('Health'),
('Science');

INSERT INTO posts (user_id, title, content) VALUES
(1, 'Introduction to PostgreSQL', 'This is a beginner tutorial for PostgreSQL.'),
(2, 'The Future of Health Tech', 'Health tech is evolving rapidly.'),
(3, 'Exploring the Science of DNA', 'The study of DNA is essential for modern biology.');

-- Inserting post-category relationships
INSERT INTO post_categories (post_id, category_id) VALUES
(1, 1), (2, 2), (3, 3);

-- More inserts to expand the script size
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Great article, very informative!'),
(2, 1, 'I agree, health tech is the future.'),
(3, 1, 'I love learning about genetics!');

-- Additional insert data to increase size
DO $$
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO users (username, email)
        VALUES
            ('user_' || i, 'user_' || i || '@example.com');

        INSERT INTO posts (user_id, title, content)
        VALUES
            (i, 'Post Title ' || i, 'Content for post ' || i);

        INSERT INTO comments (post_id, user_id, content)
        VALUES
            (i, i, 'This is comment ' || i);
    END LOOP;
END $$;

-- Adding more complexity with constraints
ALTER TABLE posts ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE comments ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id);

-- More complex indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
