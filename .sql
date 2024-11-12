USE arcadia;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) NOT NULL,
    roles JSON NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UNIQ_IDENTIFIER_EMAIL UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (email, roles, password, firstname, lastname, updated_at, created_at)
VALUES ('admin@gmail.com', '["ROLE_ADMIN"]', '$2y$13$2rdX6qJYS/Rs4REckzauCuIoXwCwKuUs2a0U01ZKwMZRTDE2DRiaa', 'Bastien', 'Terrier', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO services (name, description, created_at, updated_at)
VALUES ('Service de nettoyage', 'Service de nettoyage des habitats', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start TIME NOT NULL,
    end TIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hours (name, start, end, created_at, updated_at)
VALUES ('Heures de visite', '09:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE habitats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO habitats (name, description, created_at, updated_at)
VALUES ('Savane', 'Habitat pour les animaux de la savane', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note TEXT NOT NULL,
    state INT NOT NULL,
    upgrade INT NOT NULL,
    habitat_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (habitat_id) REFERENCES habitats(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO comments (note, state, upgrade, habitat_id, created_at, updated_at)
VALUES ('Très bon habitat', 1, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    race VARCHAR(255) NOT NULL,
    view INT NOT NULL,
    habitat_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (habitat_id) REFERENCES habitats(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO animals (name, race, view, habitat_id, created_at, updated_at)
VALUES ('Lion', 'Panthera leo', 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE feeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    animal_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO feeds (name, quantity, animal_id, created_at, updated_at)
VALUES ('Viande', 10, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    feed VARCHAR(255) NOT NULL,
    grammage INT NOT NULL,
    detailState VARCHAR(255) NOT NULL,
    animal_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO reports (state, feed, grammage, detailState, animal_id, created_at, updated_at)
VALUES ('Bon', 'Viande', 500, 'Bien nourri', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE pictures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route VARCHAR(255) NOT NULL,
    service_id INT,
    habitat_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (habitat_id) REFERENCES habitats(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO pictures (route, service_id, habitat_id, created_at, updated_at)
VALUES ('/images/savane.jpg', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);