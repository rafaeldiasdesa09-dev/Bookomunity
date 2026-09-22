import { Router } from "express";
import * as pgC from "../controllers/pageController"

export const pageRoutes = Router()

pageRoutes.get("/", pgC.startPage)