# ShopSphere — E-Commerce Design Patterns Demo

ShopSphere is a modern, responsive e-commerce website built using **HTML, CSS, and vanilla JavaScript**. It demonstrates Object-Oriented Programming (OOP) concepts and three behavioral design patterns through practical shopping features.

## Features

- **Product Catalog:** Browse products, search by name, and filter by category.
- **Shopping Cart:** Add and remove items, view totals, and apply discount coupons.
- **Price-Drop Alerts:** Subscribe to product notifications and simulate price changes.
- **Payment Selection:** Choose Card, UPI, or Wallet payment strategies.
- **Undo and Redo:** Reverse or restore supported cart actions.
- **Responsive UI:** Clean, modern design for desktop and mobile screens.

## Technologies Used

- HTML5 — Page structure
- CSS3 — Styling, layouts, and responsive design
- JavaScript (ES6+) — Application logic and design patterns

No frontend frameworks or external JavaScript libraries are required.

## Object-Oriented Programming Concepts

- **Encapsulation:** Classes manage product information, observers, payment behavior, and cart operations.
- **Abstraction:** Common interfaces hide the implementation details of payment and command operations.
- **Inheritance:** Payment strategy classes extend the common payment strategy class.
- **Polymorphism:** Different payment strategies implement the same payment operation in their own way.

## Behavioral Design Patterns

### 1. Observer Pattern

**Purpose:** Notify users when a product's price decreases.

The `Product` class maintains a collection of observers. Users can