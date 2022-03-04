/* eslint-disable no-await-in-loop */
// -----------------------------------------------------------------------------------------------//
// Archive: controllers/sales/addSale.controller.js
// Description: File responsible for the 'addSale' function of the 'sales' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const db2 = require('@model/db2');

const checkAddBuy = require('@functions/checkAddBuy');

exports.addSale = async (req, res) => {
    const { courseid } = req.body;
    const { studentid } = req.body;
    const { paymentmethodid } = req.body;
    const { price } = req.body;
    const userid = req.auth.id;
    const today = new Date();

    const check = await checkAddBuy.check(courseid, studentid, price, paymentmethodid);

    if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        try {
            /* const columns1 = {
                course_id: check.course_id,
                student_id: check.student_id,
                price: check.price,
                payment_method_id: check.payment_method_id,
                release_date: today,
            };
            const returningColumns1 = ['*'];

            const result1 = await query.InsertSale(
                'sales',
                columns1,
                returningColumns1,
            ); */

            await db2.query('BEGIN TRANSACTION');
            const result1 = await db2.query('INSERT INTO sales(course_id, student_id, price, payment_method_id, release_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    courseid,
                    studentid,
                    check.price,
                    paymentmethodid,
                    today,
                ]);

            if (result1) {
                // console.log(result1);
                const checkSelect1 = ['installments'];
                const whereCheck1 = {
                    id: {
                        operator: '=',
                        value: check.payment_method_id,
                    },
                };
                const checkOperators = [''];
                const getinstallments = await query.Select(
                    'payment_method',
                    checkSelect1,
                    whereCheck1,
                    checkOperators,
                );

                if (getinstallments.data[0].installments > 1) {
                    const due = new Date();
                    for (let i = 1; i <= getinstallments.data[0].installments; i++) {
                        // console.log(result1);
                        /* const columns2 = {
                            sale_id: result1.data[0].id,
                            installment: i,
                            subtotal: check.price,
                            due_date: due,
                            receipt_date: new Date(),
                        };
                        const returningColumns2 = ['*'];
                        await query.InsertSale(
                            'receive_bills',
                            columns2,
                            returningColumns2,
                        ); */
                        await db2.query('INSERT INTO receive_bills(sale_id, installment, subtotal, due_date) VALUES($1, $2, $3, $4) RETURNING *',
                            [
                                result1.rows[0].id,
                                i,
                                result1.rows[0].price / getinstallments.data[0].installments,
                                due,
                            ]);
                        // console.log(result2);
                        due.setDate(due.getDate() + 30 * i);
                    }
                    /* const columns3 = {
                        sale_id: result1.data[0].id,
                        teacher_id: userid,
                        price: check.price,
                        due_date: due,
                        pay_date: new Date(),
                    };
                    const returningColumns3 = ['*'];
                    const result3 = await query.InsertSale(
                        'financial_transfer',
                        columns3,
                        returningColumns3,
                    ); */
                    await db2.query('INSERT INTO financial_transfer(sale_id, teacher_id, price, due_date, pay_date) VALUES($1, $2, $3, $4, $5)',
                        [
                            result1.rows[0].id,
                            userid,
                            check.price,
                            due,
                            new Date(),
                        ]);

                    await db2.query('INSERT INTO enroll_students(student_id, course_id) VALUES($1, $2)',
                        [
                            studentid,
                            courseid,
                        ]);
                    await db2.query('COMMIT');
                    res.send('Compra sucedida');
                }
            } else {
                res.sendError(result1.error, 500);
            }
        } catch (err) {
            console.log(err);
            res.sendError('blabla', 500);
        }
    }
};
