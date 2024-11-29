# My Scraping App

This application scrapes data from specified URLs and processes it.

## Features

- Web scraping using Playwright.
- Data storage with MongoDB.
- User authentication with JWT.
- Logging with Winston.
- RESTful API endpoints.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your_username/your_repository.git
   
2. Install dependencies
    ```bash
   npm install
    
3. Create a .env file and add your environment variables
   ```bash
   MONGO_URI=your_mongo_uri
   PORT=3000
   JWT_SECRET=your_jwt_secret
   
4. Start the application
    ```bash
   npm run start
   npm run dev
    
# ScrapperPROD API Testing

This project provides a Postman collection to test the APIs of the ScrapperPROD service, which manages data scraping, analysis, and logging. Use the following guide to set up and test the API endpoints.

---

## Prerequisites

- **Postman**: Download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
- **Node.js and npm**: Ensure you have Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/).
- **Running Backend**: The backend service should be running locally or on a server. Update the `url_path` environment variable in the collection with the correct base URL (e.g., `http://localhost:3000`).

---

## Import the Collection

1. Open Postman.
2. Click on **File > Import**.
3. Select the `ScrapperPROD.postman_collection.json` file.
4. Click **Import**.

---

## Environment Variables

The following environment variable is required:

- **url_path**: The base URL of your API, e.g., `http://localhost:3000`.

Configure this in the **Environment** section of Postman.

---

## Available API Endpoints

The collection includes the following requests:

### Cron Management

1. **Start Cron**
   - Method: `POST`
   - Endpoint: `/cron/start`

2. **Stop Cron**
   - Method: `POST`
   - Endpoint: `/cron/stop`

3. **Check Cron Status**
   - Method: `GET`
   - Endpoint: `/cron/status`
   - Authorization: Bearer token required.

4. **Run Cron**
   - Method: `POST`
   - Endpoint: `/cron/run`

### Upload Operations

5. **Upload Data**
   - Method: `POST`
   - Endpoint: `/upload`

6. **Upload Logs**
   - Method: `POST`
   - Endpoint: `/upload/logs`

### Data Retrieval

7. **Get Scraped Data**
   - Method: `GET`
   - Endpoint: `/result_analysisV2`

8. **Get Scraped Data by Category**
   - Method: `GET`
   - Endpoint: `/result_analysisV2/{category}`

9. **Get Logs**
   - Method: `GET`
   - Endpoint: `/logs`

### User Authentication

10. **Register User**
    - Method: `POST`
    - Endpoint: `/auth/register`
    - Body:
      ```json
      {
        "username": "your_username",
        "password": "your_password"
      }
      ```

11. **Login User**
    - Method: `POST`
    - Endpoint: `/auth/login`
    - Body:
      ```json
      {
        "username": "your_username",
        "password": "your_password"
      }
      ```

12. **Logout User**
    - Method: `POST`
    - Endpoint: `/auth/logout`
    - Authorization: Bearer token required.

---

## Testing the Collection

1. Set the required environment variables in Postman.
2. Authenticate using the **User Login** request to retrieve a Bearer token.
3. Copy the token to the `Authorization` header for protected endpoints.
4. Run individual requests or use Postman's **Collection Runner** for automated testing.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

   
