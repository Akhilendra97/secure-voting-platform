-- ==============================
-- SECURE VOTING PLATFORM (FINAL CLEAN)
-- ==============================

DROP DATABASE IF EXISTS secure_voting;
CREATE DATABASE secure_voting;
USE secure_voting;

-- ==============================
-- 1. GOVT AADHAR DATABASE
-- ==============================
CREATE TABLE Govt_Aadhar_DB (
    aadhar_id CHAR(12) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number_linked VARCHAR(15) UNIQUE NOT NULL,
    is_biometric_verified BOOLEAN DEFAULT TRUE,
    date_of_birth DATE NOT NULL
);

INSERT INTO Govt_Aadhar_DB VALUES
('123456789012', 'Rahul Sharma', '9876543210', TRUE, '1995-01-01'),
('234567890123', 'Priya Verma', '9123456780', TRUE, '2002-05-10'),
('345678901234', 'Amit Singh', '9988776655', TRUE, '1998-07-15'),
('456789012345', 'Neha Gupta', '9090909090', TRUE, '2010-03-15'),
('567890123456', 'Arjun Mehta', '8888888888', TRUE, '1999-11-25');

-- ==============================
-- 2. USERS
-- ==============================
CREATE TABLE Users (
    voter_id INT AUTO_INCREMENT PRIMARY KEY,
    aadhar_id CHAR(12) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE,
    role VARCHAR(10) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'pending',
    voter_id_card VARCHAR(20),
    date_of_birth DATE,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (aadhar_id) REFERENCES Govt_Aadhar_DB(aadhar_id)
    ON DELETE CASCADE
);

-- ==============================
-- 3. ADMINS
-- ==============================
CREATE TABLE admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (name, email, password_hash)
VALUES (
  'Admin',
  'admin@gmail.com',
  '$2b$10$LI5N.e1RulDwYDLxDtFnqOFGXlGqUruApFDDzvum2T3q1e0dkw5IG'
);

-- ==============================
-- 4. CANDIDATES (FINAL FIXED)
-- ==============================
CREATE TABLE Candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100) NOT NULL,
    candidate_image_url TEXT,
    party_symbol_url TEXT
);

INSERT INTO Candidates (name, party, candidate_image_url, party_symbol_url)
VALUES
('Narendra Modi', 'BJP',
'https://www.jkbjp.in/wp-content/uploads/2016/11/sh_narendra_modi_27.09.2016_1-1.png',
'https://upload.wikimedia.org/wikipedia/commons/1/1b/BJP_logo.svg'),

('Rahul Gandhi', 'INC',
'https://www.elections.in/political-leaders/images/rahul-congress.jpg',
'https://upload.wikimedia.org/wikipedia/commons/4/45/Indian_National_Congress_hand_logo.svg'),

('Arvind Kejriwal', 'AAP',
'https://archive.aamaadmiparty.org/wp-content/uploads/2017/08/Arvind-Kejriwal-2.jpg',
'https://upload.wikimedia.org/wikipedia/commons/3/3b/Aam_Aadmi_Party_logo.svg');

-- ==============================
-- 5. VOTES (BLOCKCHAIN SAFE)
-- ==============================
CREATE TABLE Votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    voter_id INT UNIQUE,
    vote_hash VARCHAR(256) NOT NULL,
    previous_vote_hash VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (candidate_id) REFERENCES Candidates(candidate_id),
    FOREIGN KEY (voter_id) REFERENCES Users(voter_id) ON DELETE CASCADE
);

-- ==============================
-- 6. ELECTION CONFIG
-- ==============================
CREATE TABLE Election_Config (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Pre-Election', 'Active', 'Completed') DEFAULT 'Active'
);

INSERT INTO Election_Config (status) VALUES ('Active');

-- ==============================
-- 7. INDEXES
-- ==============================
CREATE INDEX idx_votes_candidate ON Votes(candidate_id);
CREATE INDEX idx_votes_hash ON Votes(vote_hash);

-- ==============================
-- 8. GENESIS BLOCK
-- ==============================
INSERT INTO Votes (candidate_id, voter_id, vote_hash, previous_vote_hash)
VALUES (1, NULL, 'GENESIS_HASH', NULL);

-- ==============================
-- 9. CLEAN RESET FUNCTION (IMPORTANT)
-- ==============================
-- USE THIS WHEN RESETTING ELECTION

-- DELETE FROM Votes WHERE voter_id IS NOT NULL;
-- UPDATE Users SET has_voted = 0;

-- ==============================
-- 10. TEST QUERIES
-- ==============================
SELECT * FROM Candidates;
SELECT * FROM Users;
SELECT * FROM Votes;
SELECT * FROM admins;

UPDATE admins 
SET email = 'akhilsingh1624@gmail.com'
WHERE email = 'admin@gmail.com';