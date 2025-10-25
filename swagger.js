import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VPanel API",
      version: "1.0.0",
      description: "API documentation for VPanel, a simple blog backend.",
    },
    servers: [
      {
        url: "http://localhost:5000", // update to deployed url.
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
