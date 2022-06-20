/* Create COMPANY table */
CREATE TABLE `csms`.`company` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;

/* Create COMPANY_RELATIONSHIP table */
CREATE TABLE `csms`.`company_relationship` (
  `parent_id` INT NOT NULL,
  `child_id` INT NOT NULL,
  PRIMARY KEY (`parent_id`, `child_id`),
  INDEX `fk_child_company_idx` (`child_id` ASC) VISIBLE,
  CONSTRAINT `fk_parent_company`
    FOREIGN KEY (`parent_id`)
    REFERENCES `csms`.`company` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_child_company`
    FOREIGN KEY (`child_id`)
    REFERENCES `csms`.`company` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;

/* Create STATION_TYPE table */
CREATE TABLE `csms`.`station_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `maxPower` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;

/* Create STATION table */
CREATE TABLE `csms`.`station` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `company_id` INT NOT NULL,
  `station_type_id` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `fk_company_idx` (`company_id` ASC) VISIBLE,
  INDEX `fk_station_type_idx` (`station_type_id` ASC) VISIBLE,
  CONSTRAINT `fk_company`
    FOREIGN KEY (`company_id`)
    REFERENCES `csms`.`company` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_station_type`
    FOREIGN KEY (`station_type_id`)
    REFERENCES `csms`.`station_type` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_swedish_ci;
