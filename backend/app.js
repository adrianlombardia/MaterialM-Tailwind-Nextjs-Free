const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const createDefaultAdmin = require("./utils/createDefaultAdmin"); // 👈 NUEVO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.set("trust proxy", true);

// Rutas
app.use("/api/auth", authRoutes);

// Healthcheck
app.get("/", (req, res) => {
  res.send("✅ Backend Horta OUTEIRO Auth funcionando");
});

// Inicialización
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión MySQL OK");

    await sequelize.sync({ alter: true });
    console.log("✅ Modelos sincronizados");

    // 👇 AQUÍ creamos admin/admin si no hay usuarios
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Auth server en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error inicializando backend:", err);
    process.exit(1);
  }
})();
