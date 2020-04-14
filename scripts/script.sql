USE `competencias`;

CREATE TABLE `competencia` (
    `id` INT(12) NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(400) NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE `competencia` ADD CONSTRAINT `competencia_u1` UNIQUE (nombre);


CREATE TABLE `competencia_pelicula` (
    `id` INT(12) NOT NULL AUTO_INCREMENT,
    `pelicula_id` INT(11) UNSIGNED NOT NULL,
    `competencia_id` INT(12) NOT NULL,
    PRIMARY KEY(`id`),
    CONSTRAINT `competencia_pelicula_f1` FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula`(`id`),
    CONSTRAINT `competencia_pelicula_f2` FOREIGN KEY (`competencia_id`) REFERENCES `competencia`(`id`)
);

CREATE TABLE `voto` (
    `id` INT(12) NOT NULL AUTO_INCREMENT,
    `competencia_id` INT(12) NOT NULL,
    `pelicula_id` INT(11) UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `voto_f1` FOREIGN KEY (`competencia_id`) REFERENCES `competencia`(`id`),
    CONSTRAINT `voto_f2` FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula`(`id`)
);

ALTER TABLE `competencia` ADD COLUMN `genero_id` INT(11) UNSIGNED;
ALTER TABLE `competencia` ADD COLUMN `actor_id` INT(11) UNSIGNED;
ALTER TABLE `competencia` ADD COLUMN `director_id` INT(11) UNSIGNED;

ALTER TABLE `competencia` ADD CONSTRAINT `competencia_f1` FOREIGN KEY (`genero_id`) REFERENCES `genero`(`id`);
ALTER TABLE `competencia` ADD CONSTRAINT `competencia_f2` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`);
ALTER TABLE `competencia` ADD CONSTRAINT `competencia_f3` FOREIGN KEY (`director_id`) REFERENCES `director`(`id`);


