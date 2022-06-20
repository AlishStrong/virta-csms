INSERT INTO `csms`.`station_type` (`name`, `maxPower`)
VALUES
('st 1', 10),
('st 2', 20),
('st 3', 30),
('st 4', 40),
('st 5', 50);

INSERT INTO `csms`.`company` (`name`)
VALUES
('cp 1'), # id 1, children id[2, 3]
('cp 2-1'), # id 2, parent_id 1, children id[4]
('cp 3-1'), # id 3, parent_id 1
('cp 4-2'), # id 4, parent_id 2
('cp 5'); # id 5, no parent, no children

INSERT INTO `csms`.`company_relationship` (`parent_id`, `child_id`)
VALUES
(1, 2),
(1, 3),
(2, 4);

INSERT INTO `csms`.`station`
(`name`, `company_id`, `station_type_id`)
VALUES
('s 1', 1, 1),
('s 2', 2, 2),
('s 3', 3, 3),
('s 4', 4, 4),
('s 5', 5, 5),
('s 6', 2, 3),
('s 7', 3, 4),
('s 8', 4, 4),
('s 9', 5, 5),
('s 10', 1, 1);
