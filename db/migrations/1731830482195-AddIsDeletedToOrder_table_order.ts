import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToOrderTableOrder1731830482195 implements MigrationInterface {
    name = 'AddIsDeletedToOrderTableOrder1731830482195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` DROP FOREIGN KEY \`FK_8025937032b0c2d3b1b0c563f8a\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_1a79b2f719ecd9f307d62b81093\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cff8eff4c72e7c4cb5bf045447c\``);
        await queryRunner.query(`ALTER TABLE \`voucher\` DROP FOREIGN KEY \`FK_e079f969220581b631c9123f27d\``);
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` CHANGE \`transferAmount\` \`transferAmount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`totalPrice\` \`totalPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`storeAddress\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`storeAddress\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`voucherDiscount\` \`voucherDiscount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`transactionAmount\` \`transactionAmount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`productPrice\` \`productPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`productImage\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`productImage\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`unitPrice\` \`unitPrice\` decimal(10,2) NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`unitPrice\` \`unitPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`productImage\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`productImage\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`productPrice\` \`productPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`transactionAmount\` \`transactionAmount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`voucherDiscount\` \`voucherDiscount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`storeAddress\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`storeAddress\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`totalPrice\` \`totalPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` CHANGE \`transferAmount\` \`transferAmount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`isDeleted\``);
        await queryRunner.query(`ALTER TABLE \`voucher\` ADD CONSTRAINT \`FK_e079f969220581b631c9123f27d\` FOREIGN KEY (\`storeStoreId\`) REFERENCES \`sep490_ftop\`.\`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cff8eff4c72e7c4cb5bf045447c\` FOREIGN KEY (\`voucherId\`) REFERENCES \`sep490_ftop\`.\`voucher\`(\`voucherId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_1a79b2f719ecd9f307d62b81093\` FOREIGN KEY (\`storeId\`) REFERENCES \`sep490_ftop\`.\`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` ADD CONSTRAINT \`FK_8025937032b0c2d3b1b0c563f8a\` FOREIGN KEY (\`walletUserId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
