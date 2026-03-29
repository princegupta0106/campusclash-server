CREATE DATABASE IF NOT EXISTS tournament_db;
USE tournament_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  college_name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL UNIQUE,
  is_host BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multiple colleges participate
CREATE TABLE IF NOT EXISTS inter_campus_tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_name VARCHAR(255) NOT NULL,
  prize_pool DECIMAL(10, 2),
  date DATE,
  colleges JSON,
  g_form VARCHAR(500),
  game VARCHAR(255),
  description TEXT,
  organizers JSON
);

-- Only one college participates
CREATE TABLE IF NOT EXISTS intra_campus_tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_name VARCHAR(255) NOT NULL,
  prize_pool DECIMAL(10, 2),
  date DATE,
  college VARCHAR(255),
  g_form VARCHAR(500),
  game VARCHAR(255),
  description TEXT,
  organizers JSON
);
