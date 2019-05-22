import app, { handler } from './app';
import { PRODUCTION } from './config';

const port = PRODUCTION ? 80 : 9003;

// Start server
app.listen(port, () => {
    console.log(
        'Server listening on port %s in %s mode ...',
        port,
        PRODUCTION ? 'production' : 'development'
    );
});
