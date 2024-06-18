import { Router} from "express"; 
import { crearUsuario, iniciarSesion, plataformasUsuario} from "../controllers/user.controller.js";

const router = Router()

router.post("/", crearUsuario)
router.post("/login", iniciarSesion)
router.get("/plataformas/:nom_usuario", plataformasUsuario) //Obtener las plataformas preferidas del usuario.

export default router

