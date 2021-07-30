module.exports = router => {
  router.get('/v1/ok', async ctx => {
    ctx.body = true;
  });
};
