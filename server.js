const app = require('./app');
const config = require('./config');

const { PORT } = config || 4000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
