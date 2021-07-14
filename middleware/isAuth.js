module.exports = (request, response, next) => {
    if(!request.session.userIsLoggedIn){
        return response.redirect('/');
    }
    next();
}