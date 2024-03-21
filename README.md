# Continue-With-Google

This project is a MERN (MongoDB, Express.js, React.js, Node.js) application featuring "Continue with Google" functionality.

## Getting Started

To set up the project locally, follow these steps:

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed on your system.

### Setting Up Server

1. Open your terminal and navigate to the server directory of the project using the `cd` command.

    ```bash
    cd server
    ```

2. Create a dotenv file named `.env` inside the server directory. This file will contain sensitive information.
    ```bash
    touch .env
    ```

3. Inside the `.env` file, add the following fields:

    ```bash 
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    MONGODB_URI="your_mongodb_uri"
    SESSION_SECRET="your_session_secret"
    ```

### Installing Dependencies

1. While in the server directory, install all dependencies using npm.

    ```bash
    npm install
    ```

### Setting Up Client

1. Open a new terminal window/tab.

2. Navigate to the client directory of the project.

    ```bash
    cd client
    ```

### Installing Dependencies

1.  While in the client directory, install all dependencies using npm.

    ```bash
    npm install
    ```


### Running the Application

1. Start the server by running the following command in the server directory.

 ```bash
    npm install
```


2. Open another terminal window/tab.
3. Navigate to the client directory.

```bash 
cd client
```


4. Start the client application.

```bash
npm start
```


## Usage

Once the server is up and running, you can use the "Continue with Google" feature in your application.

