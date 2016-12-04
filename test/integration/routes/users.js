describe('Routes Users', () => {
    const User = app.datasource.models.User;
    const defaultUser = {
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
                    id: user._id, // eslint-disable-line no-underscore-dangle
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
                    expect(res.body[0].name).to.be.equal(defaultUser.name);
                    done(err);
                });
        });
    });
});
