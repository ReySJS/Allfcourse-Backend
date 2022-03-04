const query = require('@helpers/Query');
const config = require('@config');
require('dotenv').config();

exports.updatecoursephoto = async (req, res) => {
    const userid = req.auth.id;
    const { id } = req.params;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send({ message: 'Nenhuma foto enviada' });
    } else if (!userid) {
        res.status(400).send({ message: 'Não autorizado' });
    } else if (!id) {
        res.status(500).send({ message: 'Preencha o ID do curso' });
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const { banner } = req.files;
        const uploadPath = `${__dirname}/banners/coursebanner-${userid}`;

        // Use the mv() method to place the file somewhere on your server
        try {
            await banner.mv(uploadPath);
            const whereColumns = {
                id: {
                    operator: '=',
                    value: userid,
                },
            };
            const fieldsValues = {};
            fieldsValues.banner_img = {
                value: `http://${config.app.host}:${config.app.port}/coursebanners/coursebanner-${userid}`,
                type: 'string',
            };

            const result = await query.Update(
                true,
                'courses',
                fieldsValues,
                ['*'],
                whereColumns,
                [''],
            );
            if (Array.isArray(result)) {
                res.status(201).send({ message: 'Foto atualizada com sucesso' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
};
