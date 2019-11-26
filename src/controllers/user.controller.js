const cacheHelper = require("../helpers/cache.helper");
const userRepository = require("../repositories/user.repository");

class UserController {
  async get(ctx) {
    try {
      const users = await userRepository.get();
      ctx.body = users;
    } catch (error) {
      ctx.status = 500;
      ctx.body = error.message || error;
    }
  }

  async getById(ctx) {
    try {
      const id = ctx.params.id;
      const cachedUser = cacheHelper.get(id);
      if (cachedUser) {
        console.log("Cached!");
        ctx.body =  cachedUser;
      }
      const user = await userRepository.getById(ctx.params.id);
      cacheHelper.set(user._id.toString(), user);
      ctx.body = user;
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = error.message || error;
    }
  }
}

module.exports = new UserController();
