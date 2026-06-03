import {v2 as cloudinary} from "cloudinary"
import Product from "../models/Product.js"
import fs from "fs";
import path from "path";

//Add Product : /api/product/add
export const addProduct = async (req, res)=>{
   try{
       let productData = JSON.parse(req.body.productData)

       const images = req.files
        
       console.log("FILES:", images);
       let imagesUrl = await Promise.all(
        images.map(async (item)=>{
            const absolutePath = path.resolve(item.path);
            let result = await cloudinary.uploader.upload(absolutePath, {
             resource_type: "image",
        });
            return result.secure_url;
        })
       )

     await Product.create({...productData,image: imagesUrl})

     res.json({success: true, message: "Product Addes"})

    } catch (error) {
        console.log("FULL PRODUCT ADD ERROR:", error);
      
        res.status(error.http_code || 500).json({
          success: false,
          message: error.message,
          http_code: error.http_code,
          name: error.name
        });
    }
}

//Get Product : /api/product/list
export const ProductList = async (req, res)=>{
    try{
        const products = await Product.find({})
        res.json({success: true, products})
    } catch( error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//Get single Product : /api/product/id
export const ProductById = async (req, res)=>{
    try{
         const { id } = req.body
         const product = await Product.findById(id)
         res.json({success: true, product})
    } catch( error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }   
}

//Get Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try{
       const { id, inStock } = req.body
       await Product.findByIdAndUpdate(id, {inStock})
       res.json({success: true, message: "Stock Updated"})
    } catch( error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

