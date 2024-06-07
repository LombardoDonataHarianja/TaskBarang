const errorHandler = (err, req, res, next) => {
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      res.status(400).json({ message: err.errors[0].message });
    } else if (err.name === "NotFound") {
      res.status(404).json({ message: "Data not Found" });
    } else if (err.name === "InvalidTotalSoldItem") {
      res.status(400).json({
        message: "Total Sold Item Should Less Than or Same with Total Stock",
      });
    } else if (err.name === "InvalidExpiredToken") {
      res.status(400).json({ message: "Invalid or expired token" });
    } else if (err.name === "EmptyStock") {
      res.status(400).json({ message: "This is item unavailable right now" });
    } else if (err.name === "Unauthorized" || err.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid email/password" });
    } else if (err.name === "OverBuying") {
      res.status(400).json({
        message: "You can't buy this item more than last current stock!",
      });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  module.exports = errorHandler;
  