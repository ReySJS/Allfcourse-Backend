// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getCourseInformations' function of the 'courses' class controller
// Data: 2021/09/01
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

exports.getCourseInformations = async (req, res) => {
    const userType = req.auth.type;
    const { courseId } = req.params;

    if (userType >= 1 && userType <= 7) {
        const columns = [
            'courses.id as course_id',
            'courses.name as name',
            'courses.banner_img as banner_img',
            'courses.description as description',
            'courses.price as value',
            'courses.status as status',
            'COUNT(enroll_students.id) as enrolleds',
            'courses.created_at as create_date',
            'courses.teacher_id AS teacher_id',
            `(
                SELECT
                CASE
                    WHEN
                        users.social_name IS NULL
                    THEN
                        CONCAT(users.first_name, ' ', users.last_name)
                    ELSE
                        CONCAT(users.social_name, ' ', users.last_name)
                    END AS teacher_name
                FROM
                    users
                WHERE
                    users.id = courses.teacher_id
                AND
                    users.deleted_at IS NULL)`,
        ];
        const table = ['courses'];
        const where = {
            'courses.id': {
                operator: '=',
                value: courseId,
            },
            'courses.deleted_at': {
                operator: 'is',
                value: 'null',
            },
        };
        const logicalOperator = ['AND'];
        const join = {
            enroll_students: {
                join: 'left join',
                on: {
                    course_id: {
                        operator: '=',
                        value: courseId,
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                },
                logicalOperators: ['AND'],
            },
            users: {
                join: 'join',
                on: {
                    id: {
                        operator: '=',
                        value: 'courses.teacher_id',
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                },
                logicalOperators: ['AND'],
            },
        };
        const order = ['courses.name'];

        const course = await query.Select(
            table,
            columns,
            where,
            logicalOperator,
            order,
            join,
            ['courses.id'],
        );

        if (Array.isArray(course.data) && course.data.length > 0) {
            const courseInformations = {
                ...course.data[0],
            };
            const categoriesColumns = [
                'courses_categories.id',
                'courses_categories.name',
            ];

            const whereCategories = {
                'courses_flags.deleted_at': {
                    operator: 'is',
                    value: 'null',
                },
                'courses_flags.course_id': {
                    operator: '=',
                    value: courseId,
                },
            };

            const logicalOperatorsCategories = ['AND'];

            const categoriesJoin = {
                courses_categories: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: 'courses_flags.category_id',
                        },
                        deleted_at: {
                            operator: 'is',
                            value: 'null',
                        },
                    },
                    logicalOperators: ['AND'],
                },
            };

            const orderBy = ['courses_categories.name'];

            const categories = await query.Select(
                'courses_flags',
                categoriesColumns,
                whereCategories,
                logicalOperatorsCategories,
                orderBy,
                categoriesJoin,
            );

            if (Array.isArray(categories.data) && categories.data.length > 0) {
                courseInformations.categories = [
                    ...categories.data,
                ];
            } else if (Array.isArray(categories.data)) {
                courseInformations.categories = [];
            } else {
                res.sendError(categories.error, 500);
                return false;
            }

            const modulesColumns = [
                'modules.id',
                'modules.name',
                'modules.description',
                'modules.module_order',
            ];

            const whereModules = {
                'modules.course_id': {
                    operator: '=',
                    value: courseId,
                },
                'modules.deleted_at': {
                    operator: 'is',
                    value: 'null',
                },
            };

            const logicalOperatorsModules = ['AND'];

            const modulesJoin = {
                courses: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: courseId,
                        },
                        deleted_at: {
                            operator: 'is',
                            value: 'null',
                        },
                    },
                    logicalOperators: ['AND'],
                },
            };

            const modulesOrderBy = ['modules.module_order'];

            const modules = await query.Select(
                'modules',
                modulesColumns,
                whereModules,
                logicalOperatorsModules,
                modulesOrderBy,
                modulesJoin,
            );

            if (Array.isArray(modules.data)) {
                for (let i = 0; i < modules.data.length; i++) {
                    const columnsClasses = [
                        'classes.id',
                        'classes.name',
                        'classes.description',
                        'classes.video_link',
                        'classes.class_order',
                    ];

                    const whereClasses = {
                        'classes.module_id': {
                            operator: '=',
                            value: modules.data[i].id,
                        },
                        'classes.deleted_at': {
                            operator: 'is',
                            value: 'null',
                        },
                    };

                    const logicalOperatorsClasses = ['AND'];

                    const classesOrderBy = ['classes.class_order'];

                    const classes = await query.Select(
                        'classes',
                        columnsClasses,
                        whereClasses,
                        logicalOperatorsClasses,
                        classesOrderBy,
                    );

                    if (Array.isArray(classes.data) && classes.data.length > 0) {
                        modules.data[i].classes = [
                            ...classes.data,
                        ];
                    } else if (Array.isArray(classes.data)) {
                        modules.data[i].classes = [];
                    } else {
                        res.sendError(classes.error, 500);
                        return false;
                    }
                }
                courseInformations.modules = [...modules.data];

                res.status(200).send([courseInformations]);
            } else {
                res.sendError(modules.error, 500);
            }
        } else if (Array.isArray(course.data)) {
            res.sendError('Não há nenhum curso com ID informado', 500);
        } else {
            res.sendError(course.error, 500);
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
