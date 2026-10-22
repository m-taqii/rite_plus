import { Router } from "express";
import authenticate, { requireStaff, requireRoles } from "../../middlewares/auth.middleware.ts";
import { uploadSingleImage } from "../../middlewares/upload.middleware.ts";
import {
    createProductHandler,
    listProductsHandler,
    searchProductsHandler,
    getProductHandler,
    updateProductHandler,
    adjustStockHandler,
    deleteProductHandler,
    uploadProductImageHandler,
    listCategoriesHandler,
    getCategoryHandler,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
} from "./products.controller.ts";

const router = Router();

// Public routes 
router.get("/list", listProductsHandler);                           // GET  /product/list
router.get("/search", searchProductsHandler);                       // GET  /product/search?q=...
router.get("/categories", listCategoriesHandler);                   // GET  /product/categories
router.get("/categories/:id", getCategoryHandler);                  // GET  /product/categories/:id
router.get("/:id", getProductHandler);                              // GET  /product/:id

// Staff routes 
router.post("/upload-image", authenticate, requireStaff, uploadSingleImage, uploadProductImageHandler); // POST /product/upload-image
router.post("/create", authenticate, requireStaff, uploadSingleImage, createProductHandler);            // POST /product/create
router.patch("/:id", authenticate, requireStaff, uploadSingleImage, updateProductHandler);              // PATCH /product/:id
router.patch("/:id/stock", authenticate, requireStaff, adjustStockHandler);                             // PATCH /product/:id/stock

// Category management routes (Staff / Admin)
router.post("/categories", authenticate, requireStaff, createCategoryHandler);                 // POST   /product/categories
router.patch("/categories/:id", authenticate, requireStaff, updateCategoryHandler);            // PATCH  /product/categories/:id
router.delete("/categories/:id", authenticate, requireStaff, deleteCategoryHandler);           // DELETE /product/categories/:id

// Admin routes 
router.delete("/:id", authenticate, requireRoles("admin"), deleteProductHandler);                       // DELETE /product/:id

export default router;