/* eslint-disable no-restricted-globals */
const pg = require('pg');
require('dotenv').config();
const dotenv = require('dotenv');
const fs = require('fs');
const sqlconnect = require('@model/db');

class QueryGenerator {
    #columns

    #params

    #returning

    #client

    #whereParams

    #whereColumns

    #orderBy

    #result

    #query

    #join

    #groupBy

    constructor() {
        this.#query = '';
        this.#columns = '';
        this.#params = '';
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
    }

    #SetClient = () => {
        dotenv.config();

        this.#client = new pg.Client({
            ...sqlconnect.sqlconnect,
        });
    }

    Insert(_beginTransaction, _table, _columnsValues, _returning) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const table = _table;
        const columnsValues = _columnsValues;
        const returning = _returning;
        const beginTransaction = _beginTransaction;

        if (
            columnsValues instanceof Object
            && !(columnsValues instanceof Array)
        ) {
            const start = Date.now();
            const columns = Object.keys(columnsValues);
            this.#columns = columns.join(', ');
            const params = [];
            const values = [];

            for (let i = 0; i < columns.length; i++) {
                params.push(`$${i + 1}`);
            }

            columns.forEach((column) => {
                values.push(columnsValues[column]);
            });

            this.#params = params.join(', ');

            if (returning) {
                if (Array.isArray(returning)) {
                    this.#returning = returning.join(', ');
                } else {
                    throw new Error('Returning must be an array');
                }
            }

            if (beginTransaction) {
                if (typeof (beginTransaction) === 'boolean') {
                    const result = this.#client
                        .connect()
                        .then(() => this.#client.query('BEGIN;'))
                        .then(() => this.#client.query(
                            `INSERT INTO ${table} (${this.#columns}) VALUES (${
                                this.#params
                            }) ${returning ? `RETURNING ${this.#returning}` : ''}`,
                            values,
                        ))
                        .then(async (result) => {
                            this.#result.data = result.rows;

                            await this.#client
                                .query('COMMIT')
                                .then(() => console.log('COMMIT SUCCESSFUL'))
                                .catch((err) => (this.#result.error.commit = err));
                            return this.#result;
                        })
                        .catch(async (err) => {
                            this.#result.error.transaction = err.message;
                            await this.#client
                                .query('ROLLBACK')
                                .then(() => console.log('ERROR, ROLLBACK'))
                                .catch(() => (this.#result.error.rollback = true));
                            return this.#result;
                        })
                        .finally(() => {
                            this.#client.end();
                            const duration = Date.now() - start;
                            fs.appendFileSync(
                                './logs/queries_log.log',
                                `executed query: { INSERT INTO ${table} (${
                                    this.#columns
                                }) VALUES (${this.#params}) ${
                                    returning ? `RETURNING ${this.#returning}` : ''
                                }, params: ${values}; duration: ${duration}ms }\n`,
                            );
                            this.#columns = '';
                            this.#params = '';
                            this.#returning = '';
                            this.#whereParams = '';
                            this.#whereColumns = '';
                            this.#orderBy = '';
                        });

                    return result;
                }
                this.#result.error.params = 'The begin transaction must be a boolean value';
                return this.#result;
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query(
                    `INSERT INTO ${table} (${this.#columns}) VALUES (${
                        this.#params
                    }) ${returning ? `RETURNING ${this.#returning}` : ''}`,
                    values,
                ))
                .then((result) => {
                    this.#result.data = result.rows;
                    return this.#result;
                })
                .catch((err) => {
                    this.#result.error.transaction = err.message;
                    return this.#result;
                })
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { INSERT INTO ${table} (${
                            this.#columns
                        }) VALUES (${this.#params}) ${
                            returning ? `RETURNING ${this.#returning}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                });

            return result;
        }
        this.#result.error.params = 'Columns and values must be arrays';
        return this.#result;
    }

    Select(_table, _columns, _whereColumnsValues, _logicalOperators, _orderBy, _join, _groupBy) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const start = Date.now();
        const table = _table;
        const columns = _columns;
        const whereColumnsValues = _whereColumnsValues;
        const logicalOperators = _logicalOperators;
        const whereColumns = [];
        const values = [];
        const orderBy = _orderBy;
        const join = _join;
        const groupBy = _groupBy;

        if (Array.isArray(columns)) {
            this.#columns = columns.join(', ');

            let param = 1;

            if (
                whereColumnsValues instanceof Object
                && !(whereColumnsValues instanceof Array)
                && Array.isArray(logicalOperators)
            ) {
                whereColumns.push(...Object.keys(whereColumnsValues));
                this.#whereColumns = whereColumns.join(', ');
                const whereParams = [];

                if (whereColumns.length !== 0) {
                    whereColumns.forEach((_column, _index) => {
                        const regex = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|not like$|ilike$|not ilike$|is$|is not$in$|not in$/i;

                        const { operator } = whereColumnsValues[_column];
                        const isValidOperator = regex.test(operator);

                        if (isValidOperator) {
                            if (
                                operator.toLowerCase() === 'like'
                                || operator.toLowerCase() === 'not like'
                                || operator.toLowerCase() === 'ilike'
                                || operator.toLowerCase() === 'not ilike'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} '%'||$${param}||'%' ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            } else if (
                                operator.toLowerCase() === 'between'
                                || operator.toLowerCase() === 'not between'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} AND $${
                                        param + 1
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(
                                    whereColumnsValues[_column].value[0],
                                    whereColumnsValues[_column].value[1],
                                );
                                param += 2;
                            } else if (
                                operator.toLowerCase() === 'is'
                                || operator.toLowerCase() === 'is not'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${
                                        whereColumnsValues[_column].value
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                            } else if (
                                operator.toLowerCase() === 'in'
                                || operator.toLowerCase() === 'not in'
                            ) {
                                let inValues = null;

                                whereColumnsValues[_column].value.forEach(
                                    (_value, _index) => {
                                        if (_index === 0) {
                                            inValues = `(${whereColumnsValues[_column].value[_index]}`;
                                        } else {
                                            inValues += `, ${whereColumnsValues[_column].value[_index]}`;
                                        }

                                        if (
                                            _index
                                            === whereColumnsValues[_column].value
                                                .length
                                                - 1
                                        ) {
                                            inValues += ')';
                                        }
                                    },
                                );

                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${inValues} ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                            } else {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            }
                        } else {
                            this.#result.error.params = 'Invalid operator on WHERE params';
                            return this.#result;
                        }
                    });
                    this.#whereParams = whereParams.join(' ');
                }
            }

            if (join) {
                if ((join instanceof Object && !(join instanceof Array))) {
                    const tables = Object.keys(join);
                    const regexJoin = /join$|inner join$|left join$|right join$|full outer join$/;
                    const regexOperator = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|is$|is not$|not like$|in$|not in$/i;
                    const whereJoinParams = [];

                    tables.forEach((_table) => {
                        const table = join[_table];

                        if ((table instanceof Object && !(table instanceof Array))) {
                            const tableJoin = join[_table].join;
                            const isValidJoin = regexJoin.test(tableJoin);

                            if (isValidJoin) {
                                const whereJoin = { ...join[_table].on };
                                const whereJoinColumns = Object.keys(whereJoin);

                                whereJoinParams.push(`${tableJoin.toUpperCase()} ${_table} ON`);
                                whereJoinColumns.forEach((_column, _indexColumn) => {
                                    const { operator } = whereJoin[_column];
                                    const isValidOperator = regexOperator.test(operator);

                                    if (isValidOperator) {
                                        const { value } = whereJoin[_column];

                                        if (operator.toLowerCase() === 'like' || operator.toLowerCase() === 'not like') {
                                            whereJoinParams.push(
                                                `${_table}.${_column} ${operator.toUpperCase()} '%'||$${param}||'%' ${
                                                    join[_table].logicalOperators[_indexColumn]
                                                        // eslint-disable-next-line max-len
                                                        ? join[_table].logicalOperators[_indexColumn]
                                                        : ''
                                                }
                                            `,
                                            );
                                            values.push(value);
                                            param++;
                                        } else if (operator.toLowerCase() === 'between' || operator.toLowerCase() === 'not between') {
                                            whereJoinParams.push(`
                                                ${_table}.${_column} ${operator.toUpperCase()}
                                                     $${param} AND $${param + 1} 
                                                ${
    join[_table].logicalOperators[_indexColumn]
        ? join[_table].logicalOperators[_indexColumn]
        : ''
}`);
                                            values.push(value[0], value[1]);
                                            param += 2;
                                        } else if (operator.toLowerCase() === 'is' || operator.toLowerCase() === 'is not') {
                                            whereJoinParams.push(`
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     ${value} 
                                                ${
    join[_table].logicalOperators[_indexColumn]
        ? join[_table].logicalOperators[_indexColumn]
        : ''
}
                                            `);
                                        } else if (operator.toLowerCase() === 'in' || operator.toLowerCase() === 'not in') {
                                            let inValues = null;

                                            value.forEach((_value, _index) => {
                                                if (_index === 0) {
                                                    inValues = `(${value[_index]}`;
                                                } else {
                                                    inValues += `, ${value[_index]}`;
                                                }

                                                if (_index === value.length - 1) {
                                                    inValues += ')';
                                                }
                                            });
                                            whereJoinParams.push(`
                                                ${_table}.${_column} ${operator.toUpperCase()} ${inValues} ${
    join[_table].logicalOperators[_indexColumn]
        ? join[_table].logicalOperators[_indexColumn]
        : ''
}`);
                                        // eslint-disable-next-line no-restricted-globals
                                        } else if (isNaN(value)) {
                                            whereJoinParams.push(`
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     ${value} 
                                                    ${
    join[_table].logicalOperators[_indexColumn]
        ? join[_table].logicalOperators[_indexColumn]
        : ''
}`);
                                        } else {
                                            whereJoinParams.push(`
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     $${param} 
                                                    ${
    join[_table].logicalOperators[_indexColumn]
        ? join[_table].logicalOperators[_indexColumn]
        : ''
}`);
                                            values.push(value);
                                            param++;
                                        }
                                    } else {
                                        this.#result.error.params = 'Invalid operator on JOIN WHERE params';
                                        return this.#result;
                                    }
                                });
                            } else {
                                this.#result.error.params = 'Invalid join type';
                                return this.#result;
                            }
                        } else {
                            this.#result.error.params = "The table to join must be an JSON containing a 'join' key that must be a string indicating the join type. A 'where' key that must be a JSON, and a 'logicalOperators' key that must be an array";
                            return this.#result;
                        }
                    });

                    this.#join = whereJoinParams.join(' ');
                } else {
                    this.#result.error.params = 'The join must be an JSON. Each key must be the name of the table to join';
                    return this.#result;
                }
            }

            if (orderBy) {
                if (Array.isArray(orderBy)) {
                    this.#orderBy = orderBy.join(', ');
                }
            }

            if (groupBy) {
                if (Array.isArray(groupBy)) {
                    this.#groupBy = groupBy.join(', ');
                }
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query(
                    `SELECT ${this.#columns} FROM ${table} ${
                        join ? this.#join : ''} ${
                        whereColumns.length !== 0
                            ? `WHERE ${this.#whereParams}`
                            : ''
                    } ${groupBy && groupBy.length > 0 ? `GROUP BY ${this.#groupBy}` : ''}
                    ${orderBy && orderBy.length > 0 ? `ORDER BY ${this.#orderBy}` : ''}`,
                    values,
                ))
                .then((result) => {
                    this.#result.data = result.rows;
                    return this.#result;
                })
                .catch((err) => (this.#result.transaction = err.message))
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { SELECT ${
                            this.#columns
                        } FROM ${table} ${
                            whereColumns.length !== 0
                                ? `WHERE ${this.#whereParams}`
                                : ''
                        } ${join ? this.#join : ''} ${
                            orderBy ? `ORDER BY ${this.#orderBy}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                    this.#join = '';
                    this.#groupBy = '';
                });
            return result;
        }
        this.#result.error.params = 'Columns, values and logical operators must be arrays';
        return this.#result;
    }

    Update(
        _beginTransaction,
        _table,
        _columnsValues,
        _returning,
        _whereColumnsValues,
        _logicalOperators,
    ) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const table = _table;
        const values = [];
        const columnsValues = _columnsValues;
        const columns = [];
        const returning = _returning;
        const whereColumnsValues = _whereColumnsValues;
        const whereColumns = [];
        const logicalOperators = _logicalOperators;
        const beginTransaction = _beginTransaction;

        if (
            columnsValues instanceof Object
            && !(columnsValues instanceof Array)
        ) {
            columns.push(...Object.keys(columnsValues));
            this.#columns = columns.join(', ');
            const params = [];

            let param = 1;
            const start = Date.now();

            columns.forEach((_column) => {
                const { value } = columnsValues[_column];
                const { type } = columnsValues[_column];

                // eslint-disable-next-line no-restricted-globals
                if (isNaN(value)) {
                    if (type) {
                        const regexType = /integer$|string$/;

                        if (regexType.test(type)) {
                            if (type.toLowerCase() === 'integer') {
                                params.push(`${_column} = ${value}`);
                                // values.push(value);
                                // param++;
                            } else {
                                params.push(`${_column} = $${param}`);
                                values.push(value);
                                param++;
                            }
                        } else {
                            this.#result.error.params = "Invalid type. Type must be 'integer' or 'string'.";
                        }
                    } else {
                        this.#result.error.params = "When providing values as a string you need to specify its type. You can do that by adding a key 'type' with a value of 'string' or 'integer'";
                    }
                } else {
                    params.push(`${_column} = $${param}`);
                    values.push(value);
                    param++;
                }
            });

            if (this.#result.error.params) {
                return this.#result;
            }

            this.#params = params.join(', ');

            if (returning) {
                if (Array.isArray(returning)) {
                    this.#returning = returning.join(', ');
                } else {
                    this.#result.error.params = 'Returning must be an array';
                    return this.#result;
                }
            }

            if (
                whereColumnsValues instanceof Object
                && !(whereColumnsValues instanceof Array)
                && Array.isArray(logicalOperators)
            ) {
                whereColumns.push(...Object.keys(whereColumnsValues));
                this.#whereColumns = whereColumns.join(', ');
                const whereParams = [];

                if (whereColumns.length !== 0) {
                    whereColumns.forEach((_column, _index) => {
                        const regex = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|not like$|ilike$|not ilike$|is$|is not$in$|not in$/i;

                        const { operator } = whereColumnsValues[_column];
                        const isValidOperator = regex.test(operator);

                        if (isValidOperator) {
                            if (
                                operator.toLowerCase() === 'like'
                                || operator.toLowerCase() === 'not like'
                                || operator.toLowerCase() === 'ilike'
                                || operator.toLowerCase() === 'not ilike'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} '%'||$${param}||'%' ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            } else if (
                                operator.toLowerCase() === 'between'
                                || operator.toLowerCase() === 'not between'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} AND $${
                                        param + 1
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(
                                    whereColumnsValues[_column].value[0],
                                    whereColumnsValues[_column].value[1],
                                );
                                param += 2;
                            } else if (
                                operator.toLowerCase() === 'is'
                                || operator.toLowerCase() === 'is not'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${
                                        whereColumnsValues[_column].value
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                            } else if (
                                operator.toLowerCase() === 'in'
                                || operator.toLowerCase() === 'not in'
                            ) {
                                let inValues = null;

                                whereColumnsValues[_column].value.forEach(
                                    (_value, _index) => {
                                        if (_index === 0) {
                                            inValues = `(${whereColumnsValues[_column].value[_index]}`;
                                        } else {
                                            inValues += `, ${whereColumnsValues[_column].value[_index]}`;
                                        }

                                        if (
                                            _index
                                            === whereColumnsValues[_column].value
                                                .length
                                                - 1
                                        ) {
                                            inValues += ')';
                                        }
                                    },
                                );

                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${inValues} ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                            // eslint-disable-next-line no-restricted-globals
                            } else {
                                // eslint-disable-next-line no-lonely-if
                                if (isNaN(whereColumnsValues[_column].value)) {
                                    whereParams.push(
                                        `${_column} ${operator.toUpperCase()} $${param} ${
                                            logicalOperators[_index]
                                                ? logicalOperators[_index]
                                                : ''
                                        }`,
                                    );
                                    values.push(whereColumnsValues[_column].value);
                                    param++;
                                } else {
                                    whereParams.push(
                                        `${_column} ${operator.toUpperCase()} $${param} ${
                                            logicalOperators[_index]
                                                ? logicalOperators[_index]
                                                : ''
                                        }`,
                                    );
                                    values.push(whereColumnsValues[_column].value);
                                    param++;
                                }
                            }
                        } else {
                            this.#result.error.params = 'Invalid operator on WHERE params';
                            return this.#result;
                        }
                    });

                    this.#whereParams = whereParams.join(' ');
                }
            }

            if (beginTransaction) {
                if (typeof (beginTransaction) === 'boolean') {
                    const result = this.#client
                        .connect()
                        .then(() => this.#client.query('BEGIN;'))
                        .then(() => this.#client.query(
                            `UPDATE ${table} SET ${this.#params} ${
                                whereColumns ? `WHERE ${this.#whereParams}` : ''
                            } ${returning ? `RETURNING ${this.#returning}` : ''}`,
                            values,
                        ))
                        .then(async (result) => {
                            this.#result.data = result.rows;
                            await this.#client
                                .query('COMMIT;')
                                .then(() => console.log('COMMIT SUCCESSFUL'))
                                .catch((err) => (this.#result.error.commit = err));

                            return this.#result;
                        })
                        .catch(async (err) => {
                            this.#result.error.transaction = err.message;

                            await this.#client
                                .query('ROLLBACK;')
                                .then(() => console.log('ERROR, ROLLBACK'))
                                .catch(() => (this.#result.error.rollback = true));

                            return this.#result;
                        })
                        .finally(() => {
                            this.#client.end();
                            const duration = Date.now() - start;
                            fs.appendFileSync(
                                './logs/queries_log.log',
                                `executed query: { UPDATE ${table} SET ${this.#params} ${
                                    whereColumns ? `WHERE ${this.#whereParams}` : ''
                                } ${
                                    returning ? `RETURNING ${this.#returning}` : ''
                                }, params: ${values}; duration: ${duration}ms }\n`,
                            );
                            this.#columns = '';
                            this.#params = '';
                            this.#returning = '';
                            this.#whereParams = '';
                            this.#whereColumns = '';
                            this.#orderBy = '';
                        });

                    return result;
                }
                this.#result.error.params = 'The begin transaction must be a boolean value';
                return this.#result;
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query(
                    `UPDATE ${table} SET ${this.#params} ${
                        whereColumns ? `WHERE ${this.#whereParams}` : ''
                    } ${returning ? `RETURNING ${this.#returning}` : ''}`,
                    values,
                ))
                .then((result) => {
                    this.#result.data = result.rows;
                    return this.#result;
                })
                .catch((err) => {
                    this.#result.error.transaction = err.message;
                    return this.#result;
                })
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { UPDATE ${table} SET ${this.#params} ${
                            whereColumns ? `WHERE ${this.#whereParams}` : ''
                        } ${
                            returning ? `RETURNING ${this.#returning}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                });

            return result;
        }
        this.#result.error.params = 'Columns and values must be arrays';
        return this.#result;
    }

    BeginTransaction() {
        this.#result = {
            error: {
                transaction: false, commit: false, rollback: false, params: false,
            },
            data: false,
        };
        this.#SetClient();
        this.#client.connect();
        this.#client.query('BEGIN;')
            .then(() => {
                console.log('BEGIN SUCCESSFUL');
            });
        // this.#client.end();
    }

    Commit() {
        this.#result = {
            error: {
                transaction: false, commit: false, rollback: false, params: false,
            },
            data: false,
        };

        this.#client.query('COMMIT;')
            .then(() => {
                console.log('COMMIT SUCCESSFUL');
                this.#client.end();
            })
            .catch((err) => this.#result.error.commit = err);

        return this.#result;
    }

    Rollback() {
        this.#result = {
            error: {
                transaction: false, commit: false, rollback: false, params: false,
            },
            data: false,
        };

        this.#client.query('ROLLBACK;')
            .then(() => {
                console.log('ROLLBACK SUCCESSFUL');
                this.#client.end();
            })
            .catch((err) => this.#result.error.rollback = err);

        return this.#result;
    }
}

const Query = new QueryGenerator();
module.exports = Query;
