# Welcome to Movie Explorer
## How to Edit This Code

There are several ways of editing your application.

### Using Your Preferred IDE

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in the repository.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/arifrhm/cine-scape-movie-explorer.git

# Step 2: Navigate to the project directory.
cd cine-scape-movie-explorer

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Editing Files Directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit them.

### Using GitHub Codespaces

1. Navigate to the main page of your repository.
2. Click on the "Code" button (green button) near the top right.
3. Select the "Codespaces" tab.
4. Click on "New codespace" to launch a new Codespace environment.
5. Edit files directly within the Codespace and commit and push your changes.

## Setting Up Environment Variables

To use the OMDb API key in your project, you need to set the environment variable in a .env file in the root of your project. 

1. Create a file named .env in the root of your project if it doesn't already exist.
2. Add the following line to the .env file:

   ```plaintext
   VITE_OMDB_API_KEY=your_api_key_here
   ```

   Replace `your_api_key_here` with your actual OMDb API key.

3. Restart your development server to ensure the environment variable is loaded.

## Building and Previewing the Application

After setting up the project and running the development server, you can also build the application for production and preview it:

1. To build the application, run:

   ```sh
   npm run build
   ```

2. To preview the built application, run:

   ```sh
   npm run preview
   ```

This will allow you to see how the application performs in a production-like environment.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
