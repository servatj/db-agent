require('dotenv').config();
const DatabaseDesignerAgent = require('./src/agents/databaseDesignerAgent');
const DataEngineerAgent = require('./src/agents/dataEngineerAgent');
const DatabaseAnalystAgent = require('./src/agents/databaseAnalystAgent');
const { addSampleData } = require('./src/utils/sampleData');

// Initialize the agents
const designerAgent = new DatabaseDesignerAgent();
const engineerAgent = new DataEngineerAgent();
const analystAgent = new DatabaseAnalystAgent();

// Example requirements for an e-commerce database
const requirements = `
Create a database for an e-commerce platform with the following requirements:

1. Store information about users, including:
   - User ID, name, email, password, address, phone number, registration date

2. Store information about products, including:
   - Product ID, name, description, price, stock quantity, category

3. Store information about orders, including:
   - Order ID, user ID, order date, total amount, status

4. Store information about order items, including:
   - Order item ID, order ID, product ID, quantity, price

5. Store information about product categories, including:
   - Category ID, name, description

6. Store information about product reviews, including:
   - Review ID, product ID, user ID, rating, comment, date

7. Ensure proper relationships between tables
8. Include appropriate indexes for performance
9. Ensure data integrity with constraints
`;

// Example analysis request
const request = `
Show me the top 5 products by sales volume, including their category and average rating.
`;

// Run the entire workflow
async function runWorkflow() {
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
      return;
    }
    
    // Step 3: Add sample data
    console.log('\nStep 3: Adding sample data...');
    const sampleDataResult = await addSampleData();
    console.log('Sample data result:', sampleDataResult.success ? 'Success' : 'Failed');
    
    if (!sampleDataResult.success) {
      console.error('Error adding sample data:', sampleDataResult.message);
      return;
    }
    
    // Step 4: Analyze data
    console.log('\nStep 4: Analyzing data...');
    const schemaInfo = await analystAgent.getSchemaInfo();
    console.log('Schema info:');
    console.log(schemaInfo);
    
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
    console.error('Error in workflow:', error);
  }
}

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.error('OpenAI API key not configured. Please set your API key in the .env file.');
} else {
  // Run the workflow
  runWorkflow();
} 