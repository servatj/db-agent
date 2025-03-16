# Database Agent System

A system with three AI agents that work together to design, build, and analyze databases:

1. **Database Designer Agent** - Designs database schemas based on requirements
2. **Data Engineer Agent** - Builds the database from the schema
3. **Database Analyst Agent** - Queries the database and provides insights

## Features

- **AI-Powered Database Design**: Generate optimal database schemas based on natural language requirements
- **Automated Database Creation**: Build SQLite databases from the generated schemas
- **Intelligent Data Analysis**: Query the database and get insights using natural language
- **Web Interface**: Simple web UI to interact with the system
- **API Endpoints**: RESTful API for integration with other systems
- **CLI Interface**: Command-line interface for quick testing

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_PATH=./database.sqlite
   ```
4. Run the application:
   ```
   npm start
   ```
   
   Or for development with auto-reload:
   ```
   npm run dev
   ```

## Usage

### Web Interface

Open your browser and navigate to `http://localhost:3000` to use the web interface.

### API Endpoints

- `POST /design` - Design a database schema based on requirements
- `POST /build` - Build a database from a schema
- `POST /sample-data` - Add sample data to the database
- `POST /analyze` - Analyze data based on a request
- `POST /workflow` - Run the entire workflow from design to analysis

### Example Script

Run the example script to see the system in action:

```
npm run example
```

### CLI Interface

Run the application and follow the prompts to use the CLI interface:

```
npm start
```

## System Architecture

- **src/agents/** - Contains the three agent implementations
  - `databaseDesignerAgent.js` - Designs database schemas
  - `dataEngineerAgent.js` - Builds databases from schemas
  - `databaseAnalystAgent.js` - Analyzes data and provides insights
- **src/utils/** - Utility functions
  - `openai.js` - OpenAI API integration
  - `database.js` - Database operations
  - `sampleData.js` - Sample data generation
- **public/** - Static web files
  - `index.html` - Web interface
- **index.js** - Main application entry point
- **example.js** - Example script

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite** - Database
- **OpenAI API** - AI models for agents
- **dotenv** - Environment variable management

## License

ISC 