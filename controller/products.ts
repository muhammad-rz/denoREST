import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Product } from '../types.ts'

// Seed product data
let products: Product[] = [
    {
       id: "1",
       name: "Banana",
       category: "Fruits",
       price: 29.99,
    }, 
    {
       id: "2",
       name: "Apple",
       category: "Fruits",
       price: 39.99,
    },
    {
       id: "3",
       name: "Avocado",
       category: "Fruits",
       price: 59.99,
    },
    {
        id: "4",
        name: "Spinach",
        category: "Vegetables",
        price: 5.99,
    },
    {
        id: "5",
        name: "Basil",
        category: "Herb",
        price: 3.99,
    },
    {
        id: "6",
        name: "Spring Onion",
        category: "Vegetables",
        price: 14.99,
    },
  ];

// --- Start Api Controller ---

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = ({ response }: { response:any }) => {
    response.body ={
        success: true,
        data: products
    }
}

// @desc    Get single products
// @route   GET /api/v1/product/:id
const getProduct = ({ params, response }: { params: { id: string }, response:any }) => {
    const product : Product | undefined = products.find(p => p.id === params.id)

    // Check the product found or not.
    if(product){
        response.status = 200
        response.body = {
            success : true,
            data: product
        }
    }else{
        response.status = 404
        response.body = {
            success : false,
            msg : 'Product not found'
        }
    }
}

// @desc    Add a product
// @route   POST /api/v1/product
const addProduct = async ({ request, response }: { request:any, response:any }) => {
    const body = await request.body()

    if(!request.hasBody){
        response.status = 400
        response.body = {
            success : false,
            msg : 'No data'
        }
    }else{
        // Get the value from request body
        const product:Product = body.value

        // Generate product ID (This is because we did not use database, database usually will create this automatically)
        // Then push the product to products
        product.id = v4.generate()
        products.push(product)

        // Send response
        response.status = 201
        response.body = {
            success : true,
            data : product
        }

    }

}

// @desc    Update a product
// @route   PUT /api/v1/product/:id
const updateProduct = async ({ params, request, response }: { params: {id:string}, request:any, response:any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id)

    // Check the product found or not.
    if (product) {
        const body = await request.body()

        const updateData: { name?: string; category?: string; price?: number } = body.value

        products = products.map(p => p.id === params.id ? { ...p, ...updateData } : p)

        response.status = 200
        response.body = {
            success: true,
            data: products
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: 'No product found'
        }
    }
}

// @desc    Delete a product
// @route   DELETE /api/v1/product/:id
const deleteProduct = ({ params, response } : { params:{id:string}, response:any }) => {
    products = products.filter(p => p.id !== params.id)
    response.body = { 
        success: true,
        msg: 'Product removed'
    }
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }