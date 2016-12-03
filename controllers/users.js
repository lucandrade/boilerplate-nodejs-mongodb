import HttStatus from 'http-status';

const defaultResponse = (data, statusCode = HttStatus.OK) => ({
    data,
    statusCode,
});

const errorResponse = (message, statusCode = HttStatus.BAD_REQUEST) => defaultResponse({
    error: message,
}, statusCode);

export default class UsersController {
    constructor(User) {
        this.model = User;
    }

    getAll() {
        return this.model.find({})
            .then(res => defaultResponse(res))
            .catch(err => errorResponse(err.message));
    }

    getById(id) {
        return this.model.findOne({
            where: {
                id,
            },
        })
        .then(res => defaultResponse(res))
        .catch(err => errorResponse(err.message));
    }

    create(data) {
        return this.model.create(data)
            .then(res => defaultResponse(res, HttStatus.CREATED))
            .catch(err => errorResponse(err.message, HttStatus.UNPROCESSABLE_ENTITY));
    }

    update(id, data) {
        return this.model.update(data, {
            where: {
                id,
            },
        })
            .then(() => this.model.findOne({ where: { id } }))
            .then(res => defaultResponse(res))
            .catch(err => errorResponse(err.message, HttStatus.UNPROCESSABLE_ENTITY));
    }

    delete(id) {
        return this.model.destroy({
            where: { id },
        })
            .then(() => defaultResponse('', HttStatus.NO_CONTENT))
            .catch(err => errorResponse(err.message, HttStatus.UNPROCESSABLE_ENTITY));
    }
}
