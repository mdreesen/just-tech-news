const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes')

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// this is here because if we make a request to an endpoint that
// does not exist, we'll receive a 404 error
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;