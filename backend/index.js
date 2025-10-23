const express = require('express');
const app = express();
const port = 3000;

const deliveryRoutes = require('./routes/deliveryRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Order.GH Backend');
});

app.use('/api', deliveryRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
