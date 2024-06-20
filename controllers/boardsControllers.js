import { pool } from '../db.js';


export const createBoard = async (req, res) => {
    const { title, columns } = req.body;
    try {
        const newBoardResult = await pool.query('INSERT INTO boards (title) VALUES ($1) RETURNING *', [title]);
        const newBoard = newBoardResult.rows[0];
        const columnPromises = columns.map(async (column, index) => {
            const newColumnResult = await pool.query('INSERT INTO columns (name, board_id, position) VALUES ($1, $2, $3) RETURNING *', [column.name, newBoard.id, index]);
            const newColumn = newColumnResult.rows[0];
            return newColumn;
        });
        const newColumns = await Promise.all(columnPromises);
        newBoard.columns = newColumns;
        res.json(newBoard);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send('Server error');
    }
};


export const getBoards = async (req, res) => {
    try {
        const boardsResult = await pool.query('SELECT * FROM boards');
        const boards = boardsResult.rows;
    
        const boardPromises = boards.map(async (board) => {
          const columnsResult = await pool.query('SELECT * FROM columns WHERE board_id = $1', [board.id]);
          const columns = columnsResult.rows;
    
          const columnPromises = columns.map(async (column) => {
            const tasksResult = await pool.query('SELECT * FROM tasks WHERE column_id = $1', [column.id]);
            const tasks = tasksResult.rows;
            return {
              id: column.id,
              title: column.name,
              tasks: tasks.map(task => ({
                id: task.id,
                title: task.title,
              })),
            };
          });
    
          const columnsWithTasks = await Promise.all(columnPromises);
    
          return {
            id: board.id,
            title: board.title,
            columns: columnsWithTasks,
          };
        });
    
        const boardsWithColumnsAndTasks = await Promise.all(boardPromises);
    
        res.json(boardsWithColumnsAndTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
      }
};