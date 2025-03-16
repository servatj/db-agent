const { getCompletion } = require('../utils/openai');
const { executeTransaction } = require('../utils/database');

/**
 * Data Engineer Agent
 * Builds the database from the schema provided by the Designer Agent
 */
class DataEngineerAgent {
  constructor() {
    this.systemPrompt = `You are a Data Engineer Agent specialized in implementing database schemas.
Your task is to:
1. Analyze SQL schema definitions
2. Verify they follow best practices
3. Identify and fix any issues
4. Execute the schema to build the database
5. Verify the database was built correctly

You should ensure:
- All SQL statements are valid and can be executed
- The schema follows best practices
- Tables are properly related
- Constraints are properly defined
- Indexes are properly created

Your output should be the final SQL statements to be executed, with any necessary corrections or improvements.`;
  }

  /**
   * Build the database from the schema
   * @param {string} schema - The SQL schema to build
   * @returns {Promise<object>} - The result of building the database
   */
  async buildDatabase(schema) {
    const userPrompt = `Please analyze and implement the following database schema:

${schema}

If there are any issues or improvements needed, please fix them and provide the final SQL statements to be executed.`;

    try {
      // Get the validated/improved schema from the agent
      const validatedSchema = await getCompletion(this.systemPrompt, userPrompt);
      
      // Extract SQL statements from the validated schema
      const statements = this.extractSqlStatements(validatedSchema);
      
      // Execute the statements in a transaction
      await executeTransaction(statements);
      
      return {
        success: true,
        message: 'Database built successfully',
        statements: statements
      };
    } catch (error) {
      console.error('Error building database:', error);
      return {
        success: false,
        message: `Error building database: ${error.message}`,
        error: error
      };
    }
  }

  /**
   * Extract SQL statements from a string
   * @param {string} schemaText - The text containing SQL statements
   * @returns {Array<string>} - Array of SQL statements
   */
  extractSqlStatements(schemaText) {
    // Remove code blocks if present (from markdown)
    let cleanText = schemaText.replace(/```sql/g, '').replace(/```/g, '');
    
    // Split by semicolons and filter out empty statements
    return cleanText
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
      .map(stmt => stmt + ';');
  }
}

module.exports = DataEngineerAgent; 