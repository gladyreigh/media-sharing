# Media Sharing App Backend - README

## Overview

This project is the **backend** of a Media Sharing App. It handles the API logic for managing media uploads, file storage, and interactions between the frontend and the database. This README will guide you through the steps to set up and run the backend of the application locally.

## Prerequisites

Before running the app, ensure you have the following installed:

- **Node.js** (preferably the latest stable version) - [Download Node.js](https://nodejs.org/)
- **Yarn** (for dependency management and running scripts) - [Install Yarn](https://yarnpkg.com/getting-started/install)

## Getting Started

### Step 1: Clone the repository

Clone the repository to your local machine by running:

```bash
git clone <repository_url>
cd <repository_name>/backend
```

### Step 2: Install Dependencies

Install the required dependencies for the backend:

```bash
yarn install
```

This will install all the necessary dependencies listed in `package.json`.

### Step 3: Configure the Environment

Make sure you have all the required environment variables set up. Typically, you’ll need to configure things like database credentials, file storage settings, and any external API keys. Create a `.env` file in the root directory of the `backend` and define your environment variables (example below):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=media_app
UPLOAD_DIR=/path/to/uploads
```

Make sure to replace the values with your actual configuration.

### Step 4: Run the Backend

To start the backend service, run the following command:

```bash
yarn run dev
```

Alternatively, if you want to start the backend in production mode:

```bash
node src/app.js
```

The backend will start, and you should see a message indicating that the app is running (usually on `http://localhost:5000`).

### Step 5: Running the Frontend

To properly interact with the backend, make sure the **frontend** server is running as well. Follow these steps to start the frontend:

1. Navigate to the **frontend** directory:

   ```bash
   cd ../frontend  # Change directory to the frontend folder
   ```

2. Install frontend dependencies (if needed):

   ```bash
   yarn install
   ```

3. Start the frontend development server:

   ```bash
   yarn run dev
   ```

Once both the frontend and backend servers are running, you can access the Media Sharing App in your web browser. Navigate to:

```
http://localhost:5173
```

You should now be able to upload, view, and manage your media files.

## File Structure

```
/backend
  ├── /src                # Source code for the backend app (controllers, models, routes, etc.)
  ├── /public             # Static files (e.g., uploaded media)
  ├── .env                # Environment variables for configuration
  ├── package.json        # Backend dependencies and scripts
  └── yarn.lock           # Yarn lockfile
/frontend
  ├── /src                # Source code for the frontend app
  ├── /public             # Static files (e.g., images, fonts, etc.)
  ├── package.json        # Frontend dependencies and scripts
  └── yarn.lock           # Yarn lockfile
```

## API Endpoints

Here are some example API endpoints the backend provides:

- **POST /api/upload** - Upload a media file.
- **GET /api/media** - Get a list of all media files.
- **GET /api/media/:id** - Get details for a specific media file.
- **DELETE /api/media/:id** - Delete a specific media file.

Check the backend code for additional routes or functionality.

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, ensure that the frontend and backend are running on different ports (e.g., frontend on `5173` and backend on `5000`) and that the backend allows cross-origin requests from the frontend.

- **Missing Dependencies**: If you see errors related to missing dependencies, run `yarn install` in the backend directory to install any required packages.

- **Port Conflicts**: If there are issues with port conflicts, you can change the default ports in the configuration files of either the frontend or backend.

- **Database Connection**: Ensure that your database is running and the credentials are correctly set in the `.env` file. If you're using a local database, make sure it's accessible from your backend application.

## Contributing

We welcome contributions! If you'd like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to update this README file based on any additional setup steps or custom configurations your project may require!
