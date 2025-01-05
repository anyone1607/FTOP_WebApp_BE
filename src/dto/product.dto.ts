import {IsNotEmpty, IsNumber, MinLength} from "class-validator";
import { Category } from "../category/entities/category.entity";
import { Store } from "../store/entities/store.entity";

export class ProductDto {
    productId?: number;
    @MinLength(4, { message: "Product name must be at least 4 characters long." })
    productName?: string;
    productPrice?: number;
    @IsNotEmpty({ message: "Category id is required." })
    categoryId?: number;    
    category?: Category; 
    status?: boolean;
    storeId?: number
    store?: Store;;  
    productImage?: string;
}