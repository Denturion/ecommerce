-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2025 at 10:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(10) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `phone` varchar(30) NOT NULL,
  `street_address` varchar(100) NOT NULL,
  `postal_code` varchar(30) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `firstname`, `lastname`, `email`, `password`, `phone`, `street_address`, `postal_code`, `city`, `country`, `created_at`) VALUES
(2, 'David', 'Kund', 'kund@gmail.com', 'Dragon', '0721234567', 'Låtsasgatan 9', '79171', 'Falun', 'Sweden', '2025-03-11 07:13:06'),
(3, 'Vogg', 'Vitek', 'vogg@gmail.com', 'Dragon', '02312345', 'Hittepågatan 12', '79171', 'Falun', 'Sweden', '2025-03-11 07:13:46'),
(16, 'David', 'Funck', 'xdavidfunckx@gmail.com', 'Dragon', '0723627534', 'Promenaden 29A', '79171', 'Falun', 'Sweden', '2025-03-20 09:21:57'),
(18, 'David', 'Funck', 'asdadagerhrjdyjtdyj@gmail.com', 'Dragon', '0723627534', 'Promenaden 29A', '79171', 'Falun', 'Sweden', '2025-03-27 10:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(10) NOT NULL,
  `customer_id` int(10) NOT NULL,
  `total_price` int(5) NOT NULL,
  `payment_status` varchar(30) NOT NULL,
  `payment_id` varchar(200) DEFAULT NULL,
  `order_status` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `total_price`, `payment_status`, `payment_id`, `order_status`, `created_at`) VALUES
(16, 18, 75, 'Paid', 'cs_test_b1IF22hQV6EdrqmRYGyxJZHctrlyWQPpcuZ4bdHBoQmwGl193B2QaBmZSm', 'Received', '2025-03-27 10:31:40'),
(17, 16, 75, 'Paid', 'cs_test_b1uPzkrWgKfAJFEe6ZvJxLF1kfx9DGkhlrOROlj9bzzi6Cj75B6s1vSaqn', 'Received', '2025-03-28 07:13:59'),
(18, 16, 100, 'Paid', 'cs_test_b18HiFAaQkqoRlIYgy9Mxg3HhqQBfjbgx8bvw5nopevn2RSBKZSVq98lhO', 'Received', '2025-03-28 09:01:10');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) NOT NULL,
  `order_id` int(10) NOT NULL,
  `product_id` int(10) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `quantity` int(5) NOT NULL,
  `unit_price` int(5) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `created_at`) VALUES
(41, 16, 6, 'Testament - The Gathering', 1, 25, '2025-03-27 10:31:40'),
(42, 16, 7, 'Testament - Souls of Black', 1, 25, '2025-03-27 10:31:40'),
(43, 16, 8, 'Testament - Live at the Fillmore', 1, 25, '2025-03-27 10:31:41'),
(44, 17, 7, 'Testament - Souls of Black', 1, 25, '2025-03-28 07:13:59'),
(45, 17, 6, 'Testament - The Gathering', 1, 25, '2025-03-28 07:14:00'),
(46, 17, 8, 'Testament - Live at the Fillmore', 1, 25, '2025-03-28 07:14:00'),
(47, 18, 6, 'Testament - The Gathering', 1, 25, '2025-03-28 09:01:10'),
(48, 18, 7, 'Testament - Souls of Black', 2, 25, '2025-03-28 09:01:10'),
(49, 18, 8, 'Testament - Live at the Fillmore', 1, 25, '2025-03-28 09:01:10');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` int(5) NOT NULL,
  `stock` int(4) NOT NULL,
  `category` varchar(100) NOT NULL,
  `image` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `category`, `image`, `created_at`) VALUES
(6, 'Testament - The Gathering', 'Testament record', 25, 5, 'Records', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Testament_%28band%29_-_The_Gathering_%28album%29.jpg/220px-Testament_%28band%29_-_The_Gathering_%28album%29.jpg', '2025-03-11 07:15:36'),
(7, 'Testament - Souls of Black', 'Testament record, 1990', 25, 5, 'Records', 'https://upload.wikimedia.org/wikipedia/en/4/4f/SoulsofBlack.jpg', '2025-03-14 08:51:04'),
(8, 'Testament - Live at the Fillmore', 'Testament live record, 1995', 25, 5, 'Records', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Testament_-_Live_at_the_Fillmore_%28album_cover%29.jpg/220px-Testament_-_Live_at_the_Fillmore_%28album_cover%29.jpg', '2025-03-14 08:51:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orderItems_orders` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_orderItems_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
