import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: mongoose.Schema.Types.Buffer,
    },
    inCart: {
        type: Number,
        default: 0
    }
})

const Product = mongoose.model('Product', productSchema)

export default Product;