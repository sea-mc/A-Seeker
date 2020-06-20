SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


CREATE SCHEMA IF NOT EXISTS `aseeker` DEFAULT CHARACTER SET utf8 ;

USE `aseeker` ;

-- -----------------------------------------------------
-- Table `aseeker`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aseeker`.`account` (
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `aseeker`.`transcription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aseeker`.`transcription` (
  `email` VARCHAR(255) NOT NULL,
  `preview` VARCHAR(45) NULL,
  `full_transcription` VARCHAR(5000) NOT NULL,
  `audio_path` VARCHAR(45) NOT NULL,
  `title` VARCHAR(45) NULL,
  PRIMARY KEY (`email`),
  CONSTRAINT `email`
    FOREIGN KEY (`email`)
    REFERENCES `aseeker`.`account` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;




--- Load demo data ---

INSERT INTO account (email, password) VALUES ('test@test.com', 'password123');
INSERT INTO transcription (email, preview, full_transcription, audio_path, title) VALUES ('test@test.com', ' This is the preview ', ' this is the full transcription', '/path/to/audiofile', 'demo transcription');


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
FLUSH PRIVILEGES;

CREATE USER 'root'@'%' IDENTIFIED BY 'toor';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';

FLUSH PRIVILEGES;
