-- Create schema
create schema conestoga_provincial_park_test;

-- test env
USE conestoga_provincial_park_test;

-- DDL
CREATE TABLE `user` (
    `id` INT NOT NULL AUTO_INCREMENT,  -- auto increased
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `address` VARCHAR(500),
    `phone_num` VARCHAR(20),
    `validation_pass` BOOLEAN NOT NULL,
    `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `idx_username` (`username`),
    UNIQUE INDEX `idx_email` (`email`),
    INDEX `idx_phone_num` (`phone_num`)
);

CREATE TABLE `user_order` (
    `user_id` INT NOT NULL,
    `order_id` INT NOT NULL,
    `order_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_order_id` (`order_id`)
);

CREATE TABLE `order` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_num` VARCHAR(255) NOT NULL,
    `trail_id` INT NOT NULL,
    `from_date` DATE NOT NULL,
    `to_date` DATE NOT NULL,
    `adult_num` INT NOT NULL DEFAULT 0,
    `child_num` INT NOT NULL DEFAULT 0,
    `parking_or_not` BOOLEAN NOT NULL DEFAULT FALSE,
    `status_code` VARCHAR(2) NOT NULL, -- Active: A, Checked-In: I, Histroy: H, Canceled: C,
    `order_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_trail_id` (`trail_id`),
    INDEX `idx_order_num` (`order_num`),
    INDEX `idx_status_code` (`status_code`)
);

CREATE TABLE `trail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trail_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `duration` int NOT NULL COMMENT 'Time to complete the trail, counted by day',
  `max_group_size` int NOT NULL,
  `length` decimal(5,2) NOT NULL COMMENT 'unit: km',
  `overview` text,
  `capacity` int NOT NULL,
  `image_main` varchar(255) NOT NULL COMMENT 'main image path for the trail',
  `image_medium` varchar(255) NOT NULL COMMENT 'image path for the medium-sized trail image',
  `image_small_left` varchar(255) NOT NULL COMMENT 'image path for a small-sized trail image on the left',
  `image_small_right` varchar(255) NOT NULL COMMENT 'image path for a small-sized trail image on the right',
  PRIMARY KEY (`id`),
  KEY `idx_location` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trail_availability` (
    `trail_id` INT NOT NULL,
    `available_seats` INT NOT NULL,
    `date` DATE NOT NULL,
    INDEX `idx_date` (`date`),
    INDEX `idx_trail_id_date` (`trail_id`, `date`)
);

CREATE TABLE `trail_campsite` (
    `trail_id` INT NOT NULL,
    `camp_id` INT NOT NULL,
    INDEX `idx_trail_id` (`trail_id`),
    INDEX `idx_camp_id` (`camp_id`)
);

CREATE TABLE `campsite` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `camp_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `email_validation` (
    `id` INT AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `validation_code` VARCHAR(255) NOT NULL,
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);