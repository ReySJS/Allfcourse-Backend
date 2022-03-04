// -----------------------------------------------------------------------------------------------//
// Archive: controllers/sales/addSale.controller.js
// Description: File responsible for the 'addSale' function of the 'sales' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const db = require('@model/db2');
const checkAddBuy = require('@functions/checkAddBuy');

exports.addSale = async (req, res) => {
    const { type } = req.auth;
    const errors = { criticalErrors: {}, validationErrors: {} };
    if (type === 1 || type === 3 || type === 7) {
        const { courseId } = req.body;
        const { studentId } = req.body;
        const { paymentMethodId } = req.body;
        const { price } = req.body;
        const userid = req.auth.id;
        const today = new Date();

        const check = await checkAddBuy.check(courseId, studentId, price, paymentMethodId);

        async function insertsale() {
            const result1 = await db.query('INSERT INTO sales(course_id, student_id, price, payment_method_id, release_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [
                    courseId,
                    studentId,
                    check.price,
                    paymentMethodId,
                    today,
                ]);
            if (result1.severity === 'ERROR') {
                await db.query('ROLLBACK');
                errors.criticalErrors.error = {
                    message: 'Ocorreu um ao inserir a venda.',
                    code: 500,
                    detail: { ...result1 },
                };
                return errors;
            }
            return result1;
        }

        async function receivebills(resultsale, getinstallments) {
            const due = new Date();
            for (let i = 1; i <= getinstallments.rows.length + 1; i++) {
                const eachbill = await db.query('INSERT INTO receive_bills(sale_id, installment, subtotal, due_date) VALUES($1, $2, $3, $4) RETURNING *',
                    [
                        resultsale.rows[0].id,
                        i,
                        resultsale.rows[0].price / getinstallments.rows[0].installments,
                        due,
                    ]);
                due.setDate(due.getDate() + 30 * i);
                if (eachbill.severity === 'ERROR') {
                    await db.query('ROLLBACK');
                    errors.criticalErrors.error = {
                        message: 'Ocorreu um erro ao inserir as contas a receber.',
                        code: 500,
                        detail: { ...eachbill },
                    };
                    return errors;
                }
            }
            return due;
        }

        async function teachertransfer(resultsale, due) {
            const transfer = await db.query('INSERT INTO financial_transfer(sale_id, teacher_id, price, due_date, pay_date) VALUES($1, $2, $3, $4, $5)',
                [
                    resultsale.rows[0].id,
                    userid,
                    check.price,
                    due,
                    new Date(),
                ]);
            if (transfer.severity === 'ERROR') {
                await db.query('ROLLBACK');
                errors.criticalErrors.error = {
                    message: 'Ocorreu um erro ao inserir pagamento do professor.',
                    code: 500,
                    detail: { ...transfer },
                };
                return errors;
            }
            return true;
        }

        async function enrollstudent() {
            const enroll = await db.query('INSERT INTO enroll_students(student_id, course_id) VALUES($1, $2)',
                [
                    studentId,
                    courseId,
                ]);
            if (enroll.severity === 'ERROR') {
                await db.query('ROLLBACK');
                errors.criticalErrors.error = {
                    message: 'Ocorreu um erro ao inserir a matrícula do aluno.',
                    code: 500,
                    detail: { ...enroll },
                };
                return errors;
            }
            return true;
        }

        if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            try {
                await db.query('BEGIN');
                const newsale = await insertsale();
                if (!newsale.criticalErrors) {
                    const getinstallments = await db.query('SELECT installments from payment_method WHERE id = $1', [check.payment_method_id]);
                    if (getinstallments.length <= 0) {
                        errors.criticalErrors.error = {
                            message: 'Metódo de pagamento não existe.',
                            code: 500,
                            detail: { ...errors },
                        };
                        res.sendError(errors, 500);
                    } else {
                        const newbill = await receivebills(newsale, getinstallments);
                        if (!newbill.criticalErrors) {
                            const newtransfer = await teachertransfer(newsale, newbill);
                            if (!newtransfer.criticalErrors) {
                                const newstudent = await enrollstudent();
                                if (!newstudent.criticalErrors) {
                                    await db.query('COMMIT');
                                    res.status(201).send({ message: 'Compra sucedida' });
                                } else {
                                    res.sendError(newstudent, 500);
                                }
                            } else {
                                res.sendError(newtransfer, 500);
                            }
                        } else {
                            res.sendError(newbill, 500);
                        }
                    }
                }
            } catch (err) {
                console.log(err);
                errors.criticalErrors.error = {
                    message: 'Ocorreu um ao realizar a compra do curso.',
                    code: 500,
                    detail: { ...err },
                };
                res.sendError(err, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
