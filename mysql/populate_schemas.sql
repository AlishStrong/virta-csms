INSERT INTO `csms`.`station_type` (`name`, `maxPower`)
VALUES
('station type 1', 10);

INSERT INTO `csms`.`company` (`name`)
VALUES
('company 1'),
('company 2'),
('company 3');

INSERT INTO `csms`.`company_relationship` (`parent_id`, `child_id`)
VALUES
(1, 2),
(1, 3);

INSERT INTO `csms`.`station`
(`name`, `company_id`, `station_type_id`)
VALUES
('station 1', 3, 1),
('station 2', 2, 1),
('station 3', 2, 1),
('station 4', 3, 1),
('station 5', 1, 1);
