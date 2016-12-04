import mongoose from 'mongoose';

describe('Routes Users', () => {
    const User = app.datasource.models.User;
    const userId = mongoose.Types.ObjectId();
    const defaultUser = {
        _id: userId,
        name: 'Defaut user',
        email: 'teste@teste.com',
        password: 'teste',
    };
    let token;
    beforeEach(done => {
        User
            .remove({})
            .then(() => User.create(defaultUser))
            .then(user => {
                token = jwt.encode({
                    id: user._id,
                    email: user.email,
                }, app.config.jwt.secret);
                done();
            });
    });
    describe('Route GET /users', () => {
        it('should return a list of users', done => {
            request
                .get('/users')
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.body[0]._id).to.be.equal(defaultUser._id.toString());
                    expect(res.body[0].name).to.be.equal(defaultUser.name);
                    done(err);
                });
        });
    });

    describe('Route GET /users/{id}', () => {
        it('should return a user', done => {
            request
                .get(`/users/${userId}`)
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.body.id).to.be.equal(defaultUser.id);
                    expect(res.body.name).to.be.equal(defaultUser.name);
                    done(err);
                });
        });
    });

    describe('Route POST /users', () => {
        it('should create a user', done => {
            const newUser = {
                _id: mongoose.Types.ObjectId(),
                name: 'newUser',
                password: 'senha',
                email: 'email@email.com',
            };

            request
                .post('/users')
                .set('Authorization', `JWT ${token}`)
                .send(newUser)
                .end((err, res) => {
                    expect(res.body._id).to.be.equal(newUser._id.toString());
                    expect(res.body.name).to.be.equal(newUser.name);
                    done(err);
                });
        });
    });
});
