'use strict'

const Drive = use('Drive');
const Helpers = use('Helpers');

class FileController {

    handle = async ({ request, response }) => {
        let path = request.input('path', '');
        let disk = request.input('disk', 'tmp');
        if (!path) return response.status(404).send("No se encontró la ruta");
        let url = Helpers.appRoot(`/${disk}/${path}`);
        // console.log(url)
        let exists = await Drive.exists(url);
        if (!exists) return response.status(404).send("No se encontró el archivo");
        return response.download(url);
    }

}

module.exports = FileController
