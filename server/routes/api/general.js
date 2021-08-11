module.exports = router => {
  router.get('/ok', async ctx => {
    ctx.body = true;
  });
};
