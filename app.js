if (process.env.NODE_ENV !== "development") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const cors = require("cors");
  const app = express();
  const routes = require("./routes/barang-routes");
  const port = process.env.PORT || 3000;
  
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(routes);
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });