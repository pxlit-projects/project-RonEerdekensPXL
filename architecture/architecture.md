# Architecture

![C4 container Diagram](C4-Containers.png)

# Description of Arrows in the Schema

### 1. **Arrow from Angular Website to API Gateway**

- **Communication**: Synchronous (HTTP/HTTPS)
- **Description**: The Angular frontend communicates with the API Gateway to send API requests for creating, updating, and deleting posts and comments. These actions are performed in real time so that users receive immediate feedback.
- **Data**: Post and comment data, such as new posts, updates, or filtering existing posts (e.g., by author or category).

### 2. **Arrow from API Gateway to Post Service, Review Service, and Comment Service**

- **Communication**: Synchronous (HTTP/HTTPS)
- **Description**: The API Gateway forwards API requests from the Angular frontend to the appropriate microservices. This allows users (editors and end-users) to directly perform actions such as creating posts or posting comments.
- **Data**:
  - **Post Service**: Post data for creating, updating, and retrieving posts.
  - **Review Service**: Requests for approving or rejecting posts.
  - **Comment Service**: Comment data for adding, viewing, editing, or deleting comments.

### 3. **Arrow from Post Service to Review Service**

- **Communication**: Asynchronous (Messaging)
- **Description**: The Post Service sends a message to the Review Service when a post is ready for review. The communication is asynchronous because the approval process doesn’t need to happen immediately. The Review Service can process these messages at its own pace.
- **Data**: Post information needed for the approval workflow, such as title, content, and metadata of the post.

### 4. **Arrow from Review Service to Post Service**

- **Communication**: Asynchronous (Messaging)
- **Description**: After a post is approved or rejected, the Review Service sends a message back to the Post Service with the approval status. This is asynchronous.
- **Data**: Approval status (approved or rejected) and any comments in case of rejection.

### 5. **Arrow from Post Service to Comment Service**

- **Communication**: Synchronous (HTTP/HTTPS)
- **Description**: The Post Service and Comment Service communicate synchronously when a user views, adds, edits, or deletes comments on posts. This allows comments to load and be edited in real-time.
- **Data**: References to the post linked to the comment, and the comment data itself, such as content, author, and edit status.

### 6. **Arrows from Config Service to all other microservices**

- **Communication**: Synchronous (HTTP/HTTPS)
- **Description**: The Config Service provides configuration settings to all microservices. This is synchronous because services need to retrieve their settings before they can function properly.
- **Data**: Configuration files such as application settings, port configurations, and API parameters.

### 7. **Arrows from Discovery Service to all other microservices**

- **Communication**: Synchronous (Eureka Service Discovery)
- **Description**: The Discovery Service registers each microservice and ensures they can locate each other on the network. This is synchronous because each service must register itself before it can operate within the system.
- **Data**: Service information such as name, location, and status.

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
