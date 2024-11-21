import {IsNotEmpty, IsNumber, MinLength} from "class-validator";

export class ProductDto {
    productId?: number;
    @MinLength(16, { message: "Product name must be at least 16 characters long." })
    productName?: string;
    productPrice?: number;
    @IsNotEmpty({ message: "Category id is required." })
    categoryId?: number;
    status?: boolean;
    storeId?: number;  
    productImage?: string;  
}