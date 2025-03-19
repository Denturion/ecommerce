import { Request, Response } from 'express';
import { db } from '../config/db';
import { ICustomer } from '../models/ICustomer';
import { logError } from '../utilities/logger';
import { ResultSetHeader } from 'mysql2';

export const getCustomers = async (_: any, res: Response) => {
	try {
		const sql = 'SELECT * FROM customers';
		const [rows] = await db.query<ICustomer[]>(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: logError(error) });
	}
};

export const getCustomerById = async (req: Request, res: Response) => {
	const id: string = req.params.id;

	try {
		const sql = 'SELECT * FROM customers WHERE id = ?';
		const [rows] = await db.query<ICustomer[]>(sql, [id]);

		rows && rows.length > 0
			? res.json(rows[0])
			: res.status(404).json({ message: 'Customer not found' });
	} catch (error) {
		res.status(500).json({ error: logError(error) });
	}
};

export const createCustomer = async (req: Request, res: Response) => {
	const {
		firstname,
		lastname,
		email,
		password,
		phone,
		street_address,
		postal_code,
		city,
		country,
	}: ICustomer = req.body;

	try {
		const sql = `
      INSERT INTO customers (firstname, lastname, email, password, phone, street_address, postal_code, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
		const params = [
			firstname,
			lastname,
			email,
			password,
			phone,
			street_address,
			postal_code,
			city,
			country,
		];
		const [result] = await db.query<ResultSetHeader>(sql, params);

		// Use the insertId to fetch the newly created customer
		const customerId = result.insertId;

		const fetchSql = 'SELECT * FROM customers WHERE id = ?';
		const [rows] = await db.query<ICustomer[]>(fetchSql, [customerId]);

		if (rows && rows.length > 0) {
			res.status(201).json(rows[0]); // Return the full customer object
		} else {
			res.status(500).json({ message: 'Failed to fetch the created customer' });
		}
	} catch (error: unknown) {
		res.status(500).json({ error: logError(error) });
	}
};

export const updateCustomer = async (req: Request, res: Response) => {
	const id: string = req.params.id;
	const {
		firstname,
		lastname,
		email,
		password,
		phone,
		street_address,
		postal_code,
		city,
		country,
	}: ICustomer = req.body;

	try {
		const sql = `
      UPDATE customers 
      SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, street_address = ?, postal_code = ?, city = ?, country = ?
      WHERE id = ?
    `;
		const params = [
			firstname,
			lastname,
			email,
			password,
			phone,
			street_address,
			postal_code,
			city,
			country,
			id,
		];
		const [result] = await db.query<ResultSetHeader>(sql, params);

		result.affectedRows === 0
			? res.status(404).json({ message: 'Customer not found' })
			: res.json({ message: 'Customer updated' });
	} catch (error) {
		res.status(500).json({ error: logError(error) });
	}
};
export const deleteCustomer = async (req: Request, res: Response) => {
	const id: string = req.params.id;

	try {
		const sql = 'DELETE FROM customers WHERE id = ?';
		const [result] = await db.query<ResultSetHeader>(sql, [id]);

		result.affectedRows === 0
			? res.status(404).json({ message: 'Customer not found' })
			: res.json({ message: 'Customer deleted' });
	} catch (error) {
		res.status(500).json({ error: logError(error) });
	}
};
