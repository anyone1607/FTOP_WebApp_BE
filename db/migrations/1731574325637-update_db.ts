import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDb1731574325637 implements MigrationInterface {
    name = 'UpdateDb1731574325637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bank_transfer\` (\`transferId\` int NOT NULL AUTO_INCREMENT, \`walletUserId\` int NOT NULL, \`accountNumber\` int NOT NULL, \`bankName\` varchar(50) NOT NULL, \`transferType\` tinyint NOT NULL, \`transferAmount\` decimal(10,2) NOT NULL, \`transferDescription\` varchar(100) NOT NULL, \`transferDate\` datetime NOT NULL, \`status\` tinyint NOT NULL, PRIMARY KEY (\`transferId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`displayName\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`walletBalance\` int NOT NULL, \`isActive\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`orderId\` int NOT NULL AUTO_INCREMENT, \`orderStatus\` tinyint NOT NULL, \`orderDate\` datetime NOT NULL, \`note\` varchar(50) NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, \`userId\` int NULL, \`storeId\` int NULL, \`voucherId\` int NULL, PRIMARY KEY (\`orderId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`voucher\` (\`voucherId\` int NOT NULL AUTO_INCREMENT, \`voucherName\` varchar(50) NOT NULL, \`voucherDiscount\` decimal(10,2) NOT NULL, \`expiredDate\` datetime NOT NULL, \`createdDate\` datetime NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`deletedAt\` timestamp NULL, \`storeStoreId\` int NOT NULL, PRIMARY KEY (\`voucherId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`store\` (\`storeId\` int NOT NULL AUTO_INCREMENT, \`storeName\` varchar(50) NOT NULL, \`storeAddress\` varchar(255) NOT NULL, \`storePhone\` int NOT NULL, \`ownerId\` int NOT NULL, \`status\` tinyint NOT NULL, PRIMARY KEY (\`storeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`reviewId\` int NOT NULL AUTO_INCREMENT, \`reviewDesscription\` varchar(100) NOT NULL, \`userId\` int NOT NULL, \`stars\` int NOT NULL, \`storeId\` int NOT NULL, PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`productId\` int NOT NULL AUTO_INCREMENT, \`productName\` varchar(50) NOT NULL, \`productPrice\` decimal(10,2) NOT NULL, \`categoryId\` int NOT NULL, \`status\` tinyint NOT NULL, \`productImage\` varchar(255) NOT NULL, \`storeId\` int NOT NULL, PRIMARY KEY (\`productId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_item\` (\`orderItemId\` int NOT NULL AUTO_INCREMENT, \`orderId\` int NOT NULL, \`productId\` int NOT NULL, \`quantity\` int NOT NULL, \`unitPrice\` decimal(10,2) NOT NULL, \`voucherId\` int NOT NULL, PRIMARY KEY (\`orderItemId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaction\` (\`transactionId\` int NOT NULL AUTO_INCREMENT, \`transferUserId\` int NOT NULL, \`receiveUserId\` int NOT NULL, \`transactionDate\` datetime NOT NULL, \`transactionAmount\` decimal(10,2) NOT NULL, \`transactionDescription\` varchar(100) NOT NULL, \`status\` tinyint NOT NULL, \`orderId\` int NOT NULL, PRIMARY KEY (\`transactionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`categoryId\` int NOT NULL AUTO_INCREMENT, \`categoryName\` varchar(50) NOT NULL, PRIMARY KEY (\`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` ADD CONSTRAINT \`FK_8025937032b0c2d3b1b0c563f8a\` FOREIGN KEY (\`walletUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_1a79b2f719ecd9f307d62b81093\` FOREIGN KEY (\`storeId\`) REFERENCES \`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cff8eff4c72e7c4cb5bf045447c\` FOREIGN KEY (\`voucherId\`) REFERENCES \`voucher\`(\`voucherId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`voucher\` ADD CONSTRAINT \`FK_e079f969220581b631c9123f27d\` FOREIGN KEY (\`storeStoreId\`) REFERENCES \`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`voucher\` DROP FOREIGN KEY \`FK_e079f969220581b631c9123f27d\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cff8eff4c72e7c4cb5bf045447c\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_1a79b2f719ecd9f307d62b81093\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` DROP FOREIGN KEY \`FK_8025937032b0c2d3b1b0c563f8a\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`transaction\``);
        await queryRunner.query(`DROP TABLE \`order_item\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP TABLE \`store\``);
        await queryRunner.query(`DROP TABLE \`voucher\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`bank_transfer\``);
    }

}
