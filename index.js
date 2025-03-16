require('dotenv').config();
const express = require('express');
const path = require('path');
const DatabaseDesignerAgent = require('./src/agents/databaseDesignerAgent');
const DataEngineerAgent = require('./src/agents/dataEngineerAgent');
const DatabaseAnalystAgent = require('./src/agents/databaseAnalystAgent');
const { addSampleData } = require('./src/utils/sampleData');

// Initialize the agents
const designerAgent = new DatabaseDesignerAgent();
const engineerAgent = new DataEngineerAgent();
const analystAgent = new DatabaseAnalystAgent();

// Create Express app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if OpenAI API key is set
app.use((req, res, next) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return res.status(500).json({
      error: 'OpenAI API key not configured. Please set your API key in the .env file.'
    });
  }
  next();
});

// Route to design a database schema
app.post('/design', async (req, res) => {
  try {
    const { requirements } = req.body;
    
    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' });
    }
    
    const schema = await designerAgent.designSchema(requirements);
    
    res.json({
      success: true,
      schema
    });
  } catch (error) {
    console.error('Error designing schema:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route to build a database
app.post('/build', async (req, res) => {
  try {
    const { schema } = req.body;
    
    if (!schema) {
      return res.status(400).json({ error: 'Schema is required' });
    }
    
    const result = await engineerAgent.buildDatabase(schema);
    
    res.json(result);
  } catch (error) {
    console.error('Error building database:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route to add sample data
app.post('/sample-data', async (req, res) => {
  try {
    const result = await addSampleData();
    res.json(result);
  } catch (error) {
    console.error('Error adding sample data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route to analyze data
app.post('/analyze', async (req, res) => {
  try {
    const { request } = req.body;
    
    if (!request) {
      return res.status(400).json({ error: 'Request is required' });
    }
    
    // Get schema information
    const schemaInfo = await analystAgent.getSchemaInfo();
    
    // Analyze data
    const result = await analystAgent.analyzeData(request, schemaInfo);
    
    res.json(result);
  } catch (error) {
    console.error('Error analyzing data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route to run the entire workflow
app.post('/workflow', async (req, res) => {
  try {
    const { requirements, request, includeSampleData } = req.body;
    
    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' });
    }
    
    if (!request) {
      return res.status(400).json({ error: 'Request is required' });
    }
    
    // Step 1: Design the schema
    console.log('Step 1: Designing schema...');
    const schema = await designerAgent.designSchema(requirements);
    
    // Step 2: Build the database
    console.log('Step 2: Building database...');
    const buildResult = await engineerAgent.buildDatabase(schema);
    
    if (!buildResult.success) {
      return res.json({
        success: false,
        step: 'build',
        error: buildResult.message,
        schema
      });
    }
    
    // Step 3: Add sample data (optional)
    let sampleDataResult = { success: true, message: 'Sample data not included' };
    if (includeSampleData) {
      console.log('Step 3: Adding sample data...');
      sampleDataResult = await addSampleData();
      
      if (!sampleDataResult.success) {
        return res.json({
          success: false,
          step: 'sample-data',
          error: sampleDataResult.message,
          schema,
          buildResult
        });
      }
    }
    
    // Step 4: Analyze data
    console.log('Step 4: Analyzing data...');
    const schemaInfo = await analystAgent.getSchemaInfo();
    const analysisResult = await analystAgent.analyzeData(request, schemaInfo);
    
    res.json({
      success: true,
      schema,
      buildResult,
      sampleDataResult,
      analysisResult
    });
  } catch (error) {
    console.error('Error in workflow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Database Agent System running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /design - Design a database schema');
  console.log('  POST /build - Build a database from a schema');
  console.log('  POST /sample-data - Add sample data to the database');
  console.log('  POST /analyze - Analyze data based on a request');
  console.log('  POST /workflow - Run the entire workflow');
});

// Command-line interface for testing
if (require.main === module) {
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('Database Agent System CLI');
  console.log('------------------------');
  console.log('1. Design a database schema');
  console.log('2. Build a database from a schema');
  console.log('3. Add sample data');
  console.log('4. Analyze data');
  console.log('5. Run the entire workflow');
  console.log('6. Exit');
  
  rl.question('Select an option: ', async (option) => {
    switch (option) {
      case '1':
        rl.question('Enter requirements: ', async (requirements) => {
          try {
            console.log('Designing schema...');
            const schema = await designerAgent.designSchema(requirements);
            console.log('Schema:');
            console.log(schema);
          } catch (error) {
            console.error('Error:', error);
          }
          rl.close();
        });
        break;
        
      case '2':
        rl.question('Enter schema: ', async (schema) => {
          try {
            console.log('Building database...');
            const result = await engineerAgent.buildDatabase(schema);
            console.log('Result:', result);
          } catch (error) {
            console.error('Error:', error);
          }
          rl.close();
        });
        break;
        
      case '3':
        try {
          console.log('Adding sample data...');
          const result = await addSampleData();
          console.log('Result:', result);
        } catch (error) {
          console.error('Error:', error);
        }
        rl.close();
        break;
        
      case '4':
        rl.question('Enter request: ', async (request) => {
          try {
            console.log('Getting schema info...');
            const schemaInfo = await analystAgent.getSchemaInfo();
            
            console.log('Analyzing data...');
            const result = await analystAgent.analyzeData(request, schemaInfo);
            console.log('Result:', result);
          } catch (error) {
            console.error('Error:', error);
          }
          rl.close();
        });
        break;
        
      case '5':
        rl.question('Enter requirements: ', (requirements) => {
          rl.question('Enter request: ', async (request) => {
            rl.question('Include sample data? (y/n): ', async (includeSampleData) => {
              try {
                // Step 1: Design the schema
                console.log('Step 1: Designing schema...');
                const schema = await designerAgent.designSchema(requirements);
                console.log('Schema:');
                console.log(schema);
                
                // Step 2: Build the database
                console.log('\nStep 2: Building database...');
                const buildResult = await engineerAgent.buildDatabase(schema);
                console.log('Build result:', buildResult.success ? 'Success' : 'Failed');
                
                if (!buildResult.success) {
                  console.error('Error building database:', buildResult.message);
                  rl.close();
                  return;
                }
                
                // Step 3: Add sample data (optional)
                if (includeSampleData.toLowerCase() === 'y') {
                  console.log('\nStep 3: Adding sample data...');
                  const sampleDataResult = await addSampleData();
                  console.log('Sample data result:', sampleDataResult.success ? 'Success' : 'Failed');
                  
                  if (!sampleDataResult.success) {
                    console.error('Error adding sample data:', sampleDataResult.message);
                    rl.close();
                    return;
                  }
                }
                
                // Step 4: Analyze data
                console.log('\nStep 4: Analyzing data...');
                const schemaInfo = await analystAgent.getSchemaInfo();
                const analysisResult = await analystAgent.analyzeData(request, schemaInfo);
                console.log('\nAnalysis result:');
                if (analysisResult.success) {
                  console.log('Query:');
                  console.log(analysisResult.query);
                  console.log('\nResults:');
                  console.log(analysisResult.results);
                  console.log('\nInsights:');
                  console.log(analysisResult.insights);
                } else {
                  console.error('Error analyzing data:', analysisResult.message);
                }
              } catch (error) {
                console.error('Error:', error);
              }
              rl.close();
            });
          });
        });
        break;
        
      case '6':
        console.log('Exiting...');
        rl.close();
        break;
        
      default:
        console.log('Invalid option');
        rl.close();
        break;
    }
  });
} 