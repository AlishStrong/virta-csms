/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql from 'mysql2/promise';
import { Errors } from '../utils/error.enums';

const executeQuery = async (sqlQuery: string, params?: any[]) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'csms'
    });

    try {
        const [results, ] = await connection.execute(sqlQuery, params);
        return results;
    } catch (error) {
        if (error instanceof Error && error.message.includes('Duplicate entry')) {
            throw new Error(Errors.DUPLICATE_ENTRY);
        } else {
            throw new Error(Errors.UNKNOWN_ISSUE);
        }
    } finally {
        await connection.end();
    }
};

export default executeQuery;
