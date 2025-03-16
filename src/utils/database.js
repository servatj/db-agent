const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Get database path from environment variables
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

/**
 * Execute a SQL query
 * @param {string} sql - The SQL query to execute
 * @param {Array} params - The parameters for the SQL query
 * @returns {Promise<any>} - The result of the query
 */
function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        reject(err);
      }
    });

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        resolve(rows);
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        }
      });
    });
  });
}

/**
 * Execute a SQL query that doesn't return rows
 * @param {string} sql - The SQL query to execute
 * @param {Array} params - The parameters for the SQL query
 * @returns {Promise<void>} - A promise that resolves when the query is executed
 */
function executeNonQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        reject(err);
      }
    });

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error executing non-query:', err);
        reject(err);
      } else {
        resolve({ 
          lastID: this.lastID, 
          changes: this.changes 
        });
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        }
      });
    });
  });
}

/**
 * Execute multiple SQL statements in a transaction
 * @param {Array<string>} statements - Array of SQL statements to execute
 * @returns {Promise<void>} - A promise that resolves when all statements are executed
 */
function executeTransaction(statements) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        reject(err);
      }
    });

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      let success = true;
      
      statements.forEach(sql => {
        if (!success) return;
        
        db.run(sql, (err) => {
          if (err) {
            console.error('Error in transaction:', err);
            success = false;
            db.run('ROLLBACK');
            reject(err);
          }
        });
      });
      
      if (success) {
        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        }
      });
    });
  });
}

module.exports = {
  executeQuery,
  executeNonQuery,
  executeTransaction
}; 