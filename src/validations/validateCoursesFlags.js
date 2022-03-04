module.exports = {
    validateCourseFlagId: (_id, _errors) => {
        const courseFlagId = _id.trim();

        if (typeof (courseFlagId) === 'string') {
            const eIndex = courseFlagId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(courseFlagId)) && Number(courseFlagId) > 0) {
                    const validCourseFlagId = Number(courseFlagId);

                    return validCourseFlagId;
                }

                _errors.courseFlagId = 'The id must be a number, positive and non-zero, for example "5"';
                return false;
            }

            _errors.courseFlagId = 'The number string must not contain the letter E/e';
            return false;
        }
        _errors.courseFlagId = 'You should pass numbers as a string';
        return false;
    },
    validateCourseId: (_id, _errors) => {
        const courseId = _id.trim();

        if (typeof (courseId) === 'string') {
            const eIndex = courseId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(courseId)) && Number(courseId) > 0) {
                    const validCourseId = Number(courseId);

                    return validCourseId;
                }

                _errors.courseId = 'The id must be a number, positive and non-zero, for example "5"';
                console.log(_errors);
                return false;
            }

            _errors.courseId = 'The number string must not contain the letter E/e';
            console.log(_errors);
            return false;
        }

        _errors.courseId = 'You should pass numbers as a string';
        return false;
    },
    validateCategoryId: (_id, _errors) => {
        const categoryId = _id.trim();

        if (typeof (categoryId) === 'string') {
            const eIndex = categoryId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(categoryId)) && Number(categoryId) > 0) {
                    const validCategoryId = Number(categoryId);

                    return validCategoryId;
                }
                _errors.categoryId = 'The id must be a number, positive and non-zero, for example "5"';
                console.log(_errors);

                return false;
            }

            _errors.categoryId = 'The number string must not contain the letter E/e';
            console.log(_errors);

            return false;
        }

        _errors.categoryId = 'You should pass numbers as a string';
        return false;
    },
};
