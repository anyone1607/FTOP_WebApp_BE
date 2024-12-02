import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBanktransferCateOrderOrderitemProductReviewStoreTransVoucherTables1729822227749 implements MigrationInterface {
    name = 'CreateBanktransferCateOrderOrderitemProductReviewStoreTransVoucherTables1729822227749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`store\` (\`storeId\` int NOT NULL AUTO_INCREMENT, \`storeName\` varchar(50) NOT NULL, \`storeAddress\` varchar(255) NOT NULL, \`storePhone\` int NOT NULL, \`ownerId\` int NOT NULL, \`status\` tinyint NOT NULL, PRIMARY KEY (\`storeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`voucher\` (\`voucherId\` int NOT NULL AUTO_INCREMENT, \`voucherName\` varchar(50) NOT NULL, \`voucherDiscount\` decimal(10,2) NOT NULL, \`storeId\` int NOT NULL, \`expiredDate\` datetime NOT NULL, \`createdDate\` datetime NOT NULL, PRIMARY KEY (\`voucherId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`reviewId\` int NOT NULL AUTO_INCREMENT, \`reviewDesscription\` varchar(100) NOT NULL, \`userId\` int NOT NULL, \`stars\` int NOT NULL, \`storeId\` int NOT NULL, PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaction\` (\`transactionId\` int NOT NULL AUTO_INCREMENT, \`transferUserId\` int NOT NULL, \`receiveUserId\` int NOT NULL, \`transactionDate\` datetime NOT NULL, \`transactionAmount\` decimal(10,2) NOT NULL, \`transactionDescription\` varchar(100) NOT NULL, \`status\` tinyint NOT NULL, \`orderId\` int NOT NULL, PRIMARY KEY (\`transactionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`productId\` int NOT NULL AUTO_INCREMENT, \`productName\` varchar(50) NOT NULL, \`productPrice\` decimal(10,2) NOT NULL, \`categoryId\` int NOT NULL, \`status\` tinyint NOT NULL, \`storeId\` int NOT NULL, PRIMARY KEY (\`productId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_item\` (\`orderItemId\` int NOT NULL AUTO_INCREMENT, \`orderId\` int NOT NULL, \`productId\` int NOT NULL, \`quantity\` int NOT NULL, \`unitPrice\` decimal(10,2) NOT NULL, \`voucherId\` int NOT NULL, PRIMARY KEY (\`orderItemId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`orderId\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`storeId\` int NOT NULL, \`orderStatus\` tinyint NOT NULL, \`orderDate\` datetime NOT NULL, \`voucherId\` int NOT NULL, \`note\` varchar(50) NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, PRIMARY KEY (\`orderId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bank_transfer\` (\`transferId\` int NOT NULL AUTO_INCREMENT, \`walletUserId\` int NOT NULL, \`accountNumber\` int NOT NULL, \`bankName\` varchar(50) NOT NULL, \`transferType\` tinyint NOT NULL, \`transferAmount\` decimal(10,2) NOT NULL, \`transferDescription\` varchar(100) NOT NULL, \`transferDate\` datetime NOT NULL, \`status\` tinyint NOT NULL, PRIMARY KEY (\`transferId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`categoryId\` int NOT NULL AUTO_INCREMENT, \`categoryName\` varchar(50) NOT NULL, PRIMARY KEY (\`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`bank_transfer\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`order_item\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`transaction\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP TABLE \`voucher\``);
        await queryRunner.query(`DROP TABLE \`store\``);
    }

}
