import mysql from 'mysql2/promise';
import { Errors } from '../utils/error.enums';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeQuery = async (sqlQuery: string, params?: any[]) => {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        port: +(process.env.MYSQL_PORT || '3306'),
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_SCHEMA
    });

    try {
        const [results, ] = await connection.execute(sqlQuery, params);
        return results;
    } catch (error) {
        if (error instanceof Error && error.message.includes('Duplicate entry')) {
            throw new Error(Errors.DUPLICATE_ENTRY);
        } else {
            console.log(error);
            throw new Error(Errors.UNKNOWN_ISSUE);
        }
    } finally {
        await connection.end();
    }
};

export default executeQuery;
