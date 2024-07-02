import { Router} from "express"; 
import {crearGrupo, unirseAGrupo, obtenerGruposUsuario, obtenerUsuariosGrupo} from "../controllers/grupos.controller.js";

const router = Router()

router.post("/:nom_usuario/:nombre_grupo", crearGrupo)
router.post("/unirse/:nom_usuario/:nombre_grupo", unirseAGrupo)
router.get("/:nom_usuario", obtenerGruposUsuario)
router.get("/usuario/:nombre_grupo", obtenerUsuariosGrupo)

export default router

