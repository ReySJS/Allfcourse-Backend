const config = require('@config');
const db = require('@model/db2');
const path = require('path');
require('dotenv').config();

exports.updatephoto = async (req, res) => {
    const userid = req.auth.id;
    const errors = { criticalErrors: {}, validationErrors: {} };
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: 'Nenhuma foto enviada' });
    } else if (!userid) {
        res.status(400).send({ message: 'Não autorizado' });
    } else {
        const { avatar } = req.files;
        console.log(avatar);
        const uploadPath = path.join(__dirname, `../../avatars/userphoto-${userid}.jpg`);

        async function updateDb() {
            await db.query('BEGIN');
            const result = await db.query('UPDATE users set profile_photo = $1 WHERE id = $2 RETURNING *',
                [
                    `http://${config.app.host}:${config.app.port}/avatars/userphoto-${userid}.jpg`,
                    userid,
                ]);
            if (Array.isArray(result.rows)) {
                await db.query('COMMIT');
                return ({ message: 'Foto atualizada com sucesso' });
            }
            errors.criticalErrors.photo = {
                message: 'Ocorreu um erro ao atualizar a foto.',
                code: 500,
            };
            await db.query('ROLLBACK');
            return errors;
        }

        try {
            const update = await updateDb();
            if (update.criticalErrors) {
                res.sendError(errors, 500);
            } else {
                await avatar.mv(uploadPath);
                res.status(201).send({ message: 'Foto atualizada com sucesso' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
};
