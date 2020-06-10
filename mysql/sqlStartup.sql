SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
