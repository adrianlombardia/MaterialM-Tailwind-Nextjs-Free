const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createDefaultAdmin() {
    try {
        const totalUsers = await User.count();

        if (totalUsers === 0) {
            console.log("⚠️ No existen usuarios. Creando usuario administrador por defecto...");

            const passwordHash = await bcrypt.hash("admin", 10);

            await User.create({
                name: "Administrador",
                email: "admin@admin.com",
                passwordHash,
                role: "admin",
                isActive: true,
            });

            console.log("✅ Usuario admin creado: admin@admin.com / admin");
        } else {
            console.log("✔️ Usuarios existentes detectados. No se crea admin por defecto.");
        }
    } catch (err) {
        console.error("❌ Error creando usuario admin por defecto:", err);
    }
}

module.exports = createDefaultAdmin;
