const { getCompletion } = require("../utils/openai");
const { executeQuery } = require("../utils/database");

/**
 * Database Analyst Agent
 * Queries the database and provides insights based on stakeholder requests
 */
class DatabaseAnalystAgent {
  constructor() {
    this.systemPrompt = `You are a Database Analyst Agent specialized in querying databases and providing insights.
Your task is to:
1. Analyze stakeholder requests for data
2. Create optimal SQL queries to retrieve the requested data
3. Execute the queries against the database
4. Analyze the results and provide insights
5. Format the results in a clear and understandable way

You should ensure:
- Queries are optimized for performance
- Results are presented clearly
- Insights are actionable and valuable
- Complex data is explained in simple terms

Your output should include:
1. The SQL query you created
2. The results of the query
3. Your analysis and insights based on the data`;
  }

  /**
   * Query the database and provide insights
   * @param {string} request - The stakeholder request
   * @param {object} schemaInfo - Information about the database schema
   * @returns {Promise<object>} - The query results and insights
   */
  async analyzeData(request, schemaInfo) {
    const userPrompt = `Please analyze the following request and provide insights based on the database schema:

Request: ${request}

Database Schema:
${schemaInfo}

Create an SQL query to retrieve the requested data, execute it, and provide insights based on the results.`;

    try {
      // Get the query from the agent
      const analysisResponse = await getCompletion(
        this.systemPrompt,
        userPrompt
      );

      // Extract the SQL query from the response
      const sqlQuery = this.extractSqlQuery(analysisResponse);

      if (!sqlQuery) {
        return {
          success: false,
          message:
            "Could not extract a valid SQL query from the agent response",
          agentResponse: analysisResponse,
        };
      }

      // Execute the query
      const queryResults = await executeQuery(sqlQuery);

      // Get insights based on the results
      const insightsPrompt = `I executed the SQL query and got the following results:

${JSON.stringify(queryResults, null, 2)}

Based on these results, please provide insights and analysis.`;

      const insights = await getCompletion(this.systemPrompt, insightsPrompt);

      return {
        success: true,
        query: sqlQuery,
        results: queryResults,
        insights: insights,
        fullResponse: analysisResponse,
      };
    } catch (error) {
      console.error("Error analyzing data:", error);
      return {
        success: false,
        message: `Error analyzing data: ${error.message}`,
        error: error,
      };
    }
  }

  /**
   * Extract SQL query from agent response
   * @param {string} response - The agent response
   * @returns {string|null} - The extracted SQL query or null if not found
   */
  extractSqlQuery(response) {
    // Try to extract query from code blocks
    const codeBlockRegex = /```sql\s*([\s\S]*?)\s*```|```\s*([\s\S]*?)\s*```/g;
    const codeBlockMatch = codeBlockRegex.exec(response);

    if (codeBlockMatch) {
      return (codeBlockMatch[1] || codeBlockMatch[2]).trim();
    }

    // Try to find SELECT statements
    const selectRegex = /(SELECT[\s\S]*?FROM[\s\S]*?)(;|$)/i;
    const selectMatch = selectRegex.exec(response);

    if (selectMatch) {
      return selectMatch[1].trim();
    }

    return null;
  }

  /**
   * Get schema information from the database
   * @returns {Promise<string>} - The database schema information
   */
  async getSchemaInfo() {
    try {
      // Query to get table information
      const tables = await executeQuery(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%';
      `);

      let schemaInfo = "";

      // For each table, get column information
      for (const table of tables) {
        const columns = await executeQuery(`PRAGMA table_info(${table.name});`);

        schemaInfo += `Table: ${table.name}\n`;
        schemaInfo += "Columns:\n";

        columns.forEach((col) => {
          schemaInfo += `  - ${col.name} (${col.type})${
            col.pk ? " PRIMARY KEY" : ""
          }${col.notnull ? " NOT NULL" : ""}\n`;
        });

        schemaInfo += "\n";
      }

      return schemaInfo;
    } catch (error) {
      console.error("Error getting schema info:", error);
      throw error;
    }
  }
}

module.exports = DatabaseAnalystAgent;
