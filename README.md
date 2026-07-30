# LocalLoop - Backend

A secure and scalable backend for the **LocalLoop Community Marketplace** application built using **Spring Boot**, **Spring Security**, **JWT Authentication**, and **PostgreSQL**.

---

## 📌 Project Overview

LocalLoop is a community-based marketplace that allows users to:

- Buy and sell products within their community
- Offer and request local services
- Join or create communities
- Communicate through an integrated chat system
- Apply as a Service Provider
- Manage communities through Community Leaders
- Manage the entire platform through an Admin Portal

This repository contains the backend APIs and business logic powering the application.

---

## 🚀 Features

### Authentication
- User Registration
- Secure Login
- JWT Authentication
- Role-Based Authorization

### Community Management
- Create Community
- Join Community
- Community Leader Management

### Marketplace
- Create Listings
- Edit Listings
- Delete Listings
- Browse Listings
- Search Listings

### Service Provider
- Apply to Become a Service Provider
- Leader Approval Workflow
- Provider Status Management

### User Profile
- View Profile
- Update Profile
- Profile Image Support

### Chat
- Buyer ↔ Seller Messaging
- Chat History
- Inbox APIs

### Reviews
- Add Reviews
- Ratings
- View Reviews

### Admin Portal
- Manage Users
- Manage Communities
- Manage Listings
- Manage Service Providers
- Dashboard Analytics

---

## 🛠 Tech Stack

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- JWT
- Maven

---

## 📁 Project Structure

```text
src/
├── main/
│   ├── java/
│   │   └── com/localloop/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── exception/
│   │       ├── repository/
│   │       ├── security/
│   │       ├── service/
│   │       └── util/
│   └── resources/
│       └── application.properties
└── test/
```

---

## ⚙️ Prerequisites

- Java 21
- Maven
- PostgreSQL
- Git

---

## ▶️ Getting Started

### Clone Repository

```bash
git clone https://github.com/SRINU-GIT-HUB/Team_36_Backend.git
```

Navigate to the project:

```bash
cd Team_36_Backend
```

---

## Configure Database

Update:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/trustbridge_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
```

---

## Run the Application

Using Maven Wrapper:

Windows

```bash
mvnw.cmd spring-boot:run
```

Linux/macOS

```bash
./mvnw spring-boot:run
```

Or

```bash
mvn spring-boot:run
```

---

## Frontend Repository

Frontend Repository:

https://github.com/SRINU-GIT-HUB/Team_36_Frontend

---

## Future Enhancements

- Real-time Chat using WebSockets
- Push Notifications
- Email Verification
- OTP Authentication
- Image Upload
- Payment Integration
- Admin Analytics Dashboard
- Community Events
- AI-based Recommendations

---

## 👨‍💻 Developed By

**Team 36**

Project Name: **LocalLoop – Community Marketplace**

Academic Project

---

## 📄 License

This project is developed for educational purposes.
