const { getCompletion } = require('../utils/openai');

/**
 * Database Designer Agent
 * Designs database schemas based on stakeholder requirements
 */
class DatabaseDesignerAgent {
  constructor() {
    this.systemPrompt = `You are a Database Designer Agent specialized in creating optimal database schemas.
Your task is to analyze requirements and create a well-structured database schema with proper:
- Tables and relationships
- Primary and foreign keys
- Data types
- Constraints
- Indexes for performance
- Normalization to reduce redundancy

Always follow these best practices:
1. Use appropriate naming conventions
2. Ensure proper normalization (typically 3NF)
3. Design for performance and scalability
4. Include appropriate indexes
5. Use appropriate data types
6. Consider referential integrity

Your output should be a complete SQL schema definition that can be executed directly.`;
  }

  /**
   * Design a database schema based on requirements
   * @param {string} requirements - The requirements for the database
   * @returns {Promise<string>} - The SQL schema
   */
  async designSchema(requirements) {
    const userPrompt = `Please design a database schema based on the following requirements:

${requirements}

Provide the complete SQL schema with CREATE TABLE statements, including all necessary constraints, indexes, and relationships.`;

    try {
      const schema = await getCompletion(this.systemPrompt, userPrompt);
      return schema;
    } catch (error) {
      console.error('Error designing schema:', error);
      throw error;
    }
  }
}

module.exports = DatabaseDesignerAgent; 