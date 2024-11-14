# Architecture

![C4 container Diagram](C4-Containers.png)

# Description of Relationships Between Services. (Blue Arrows)

**Fetch Posts Concepts (U7)**

When an editor wants to review submitted posts for approval or rejection, the post concepts are retrieved through synchronous communication with the Post Services. The status of a post (approved or rejected) is stored in the database of the Post Services.

**Update Status Post Concepts (U8)**

When a post is approved or rejected, its status is updated in the Post Services database via an asynchronous connection (RabbitMQ). Additionally, the Review Services sends an email to the editor to notify them of the approval or rejection.

**Fetch Posts Remarks (U9)**

When an editor requests a post that has been rejected, the associated remarks are retrieved through synchronous communication with the Review Services. This allows the editor to read the feedback that led to the post’s rejection.

**Fetch Post Comments (U11)**

When a user requests a post, the comments on that post are also retrieved through synchronous communication with the Comment Services. This enables the user to read the comments associated with the post.

# C4-Container Diagram Description

This C4-Container diagram illustrates a content management and publication system built using a microservices architecture in Spring Boot. The system has the following components:

## 1. Angular Frontend

This is a web application built with Angular (using TypeScript) accessible by two user roles:

- **Editor**: Visits the system as an editor.
- **User**: Visits the system as a regular user.

The frontend makes HTTP/HTTPS API calls to the backend services through an API Gateway.

## 2. API Gateway

This component serves as a central entry point, routing incoming requests from the Angular frontend to the appropriate microservices (Post Service, Review Service, and Comment Service). It also ensures secure communication between the frontend and backend.

## 3. Microservices

Each microservice is built with Spring Boot and has its own dedicated MySQL database for data persistence:

- **Post Service**: Manages posts and communicates with its own MySQL Post Database.
- **Review Service**: Focuses on managing reviews and interacts with its MySQL Review Database.
- **Comment Service**: Handles comments and uses its MySQL Comment Database.

Each microservice makes API calls through the API Gateway and communicates with its respective database for CRUD operations.

## 4. Discovery Service

Implemented using Netflix Eureka, this service manages service registration and discovery, enabling other services to locate and communicate with each other within the system.

## 5. Config Service

This centralized configuration service provides configuration files to each microservice, ensuring consistency and easy management of application properties across all services.

## Inter-service Communication

Each microservice can exchange messages through the Discovery Service using OpenFeign for inter-service messaging, supporting seamless communication and integration between services.
