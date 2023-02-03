import express from "express"
import NamesCtrl from "./names.controller.js"

const router = express.Router()

router.route("/").get(NamesCtrl.apiGetNames);
router.route("/similar").get(NamesCtrl.apiGetCurve);

export default router