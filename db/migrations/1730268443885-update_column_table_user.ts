import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColumnTableUser1730268443885 implements MigrationInterface {
    name = 'UpdateColumnTableUser1730268443885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`storeId\` \`storeStoreId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`walletBalance\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isActive\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`storeAddress\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`storeAddress\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`voucherDiscount\` \`voucherDiscount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`transactionAmount\` \`transactionAmount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`unitPrice\` \`unitPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`productPrice\` \`productPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`totalPrice\` \`totalPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` CHANGE \`transferAmount\` \`transferAmount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` ADD CONSTRAINT \`FK_e079f969220581b631c9123f27d\` FOREIGN KEY (\`storeStoreId\`) REFERENCES \`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`voucher\` DROP FOREIGN KEY \`FK_e079f969220581b631c9123f27d\``);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` CHANGE \`transferAmount\` \`transferAmount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`totalPrice\` \`totalPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`productPrice\` \`productPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`unitPrice\` \`unitPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`transactionAmount\` \`transactionAmount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`voucherDiscount\` \`voucherDiscount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`storeAddress\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`storeAddress\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`walletBalance\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`storeStoreId\` \`storeId\` int NOT NULL`);
    }

}
