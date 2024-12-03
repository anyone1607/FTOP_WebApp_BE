import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUserAddPinField1733211409179 implements MigrationInterface {
    name = 'UpdateTableUserAddPinField1733211409179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`voucher\` DROP FOREIGN KEY \`FK_e079f969220581b631c9123f27d\``);
        await queryRunner.query(`ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_a83068090fe4511e5047484b09a\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_1a79b2f719ecd9f307d62b81093\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cff8eff4c72e7c4cb5bf045447c\``);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` DROP FOREIGN KEY \`FK_8025937032b0c2d3b1b0c563f8a\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_a6e45c89cfbe8d92840266fd30f\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_f05df84c621b290c7e22ec529b8\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_f6204a9a4aabc1195fddcb3e917\``);
        await queryRunner.query(`DROP INDEX \`IDX_a83068090fe4511e5047484b09\` ON \`store\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pin\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`voucherDiscount\` \`voucherDiscount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`storeAddress\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`storeAddress\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`totalPrice\` \`totalPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` CHANGE \`transferAmount\` \`transferAmount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phoneNumber\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phoneNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`transactionAmount\` \`transactionAmount\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`productPrice\` \`productPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`productImage\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`productImage\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`unitPrice\` \`unitPrice\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` ADD CONSTRAINT \`FK_e079f969220581b631c9123f27d\` FOREIGN KEY (\`storeStoreId\`) REFERENCES \`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`store\` ADD CONSTRAINT \`FK_a83068090fe4511e5047484b09a\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_1a79b2f719ecd9f307d62b81093\` FOREIGN KEY (\`storeId\`) REFERENCES \`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cff8eff4c72e7c4cb5bf045447c\` FOREIGN KEY (\`voucherId\`) REFERENCES \`voucher\`(\`voucherId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` ADD CONSTRAINT \`FK_8025937032b0c2d3b1b0c563f8a\` FOREIGN KEY (\`walletUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_a6e45c89cfbe8d92840266fd30f\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`orderId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_f05df84c621b290c7e22ec529b8\` FOREIGN KEY (\`transferUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_f6204a9a4aabc1195fddcb3e917\` FOREIGN KEY (\`receiveUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_f6204a9a4aabc1195fddcb3e917\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_f05df84c621b290c7e22ec529b8\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_a6e45c89cfbe8d92840266fd30f\``);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` DROP FOREIGN KEY \`FK_8025937032b0c2d3b1b0c563f8a\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cff8eff4c72e7c4cb5bf045447c\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_1a79b2f719ecd9f307d62b81093\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_a83068090fe4511e5047484b09a\``);
        await queryRunner.query(`ALTER TABLE \`voucher\` DROP FOREIGN KEY \`FK_e079f969220581b631c9123f27d\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`unitPrice\` \`unitPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`productImage\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`productImage\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`productPrice\` \`productPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction\` CHANGE \`transactionAmount\` \`transactionAmount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phoneNumber\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phoneNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`displayName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` CHANGE \`transferAmount\` \`transferAmount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`totalPrice\` \`totalPrice\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`storeAddress\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`storeAddress\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`voucher\` CHANGE \`voucherDiscount\` \`voucherDiscount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pin\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_a83068090fe4511e5047484b09\` ON \`store\` (\`ownerId\`)`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_f6204a9a4aabc1195fddcb3e917\` FOREIGN KEY (\`receiveUserId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_f05df84c621b290c7e22ec529b8\` FOREIGN KEY (\`transferUserId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_a6e45c89cfbe8d92840266fd30f\` FOREIGN KEY (\`orderId\`) REFERENCES \`sep490_ftop\`.\`order\`(\`orderId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bank_transfer\` ADD CONSTRAINT \`FK_8025937032b0c2d3b1b0c563f8a\` FOREIGN KEY (\`walletUserId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cff8eff4c72e7c4cb5bf045447c\` FOREIGN KEY (\`voucherId\`) REFERENCES \`sep490_ftop\`.\`voucher\`(\`voucherId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_1a79b2f719ecd9f307d62b81093\` FOREIGN KEY (\`storeId\`) REFERENCES \`sep490_ftop\`.\`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`store\` ADD CONSTRAINT \`FK_a83068090fe4511e5047484b09a\` FOREIGN KEY (\`ownerId\`) REFERENCES \`sep490_ftop\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`voucher\` ADD CONSTRAINT \`FK_e079f969220581b631c9123f27d\` FOREIGN KEY (\`storeStoreId\`) REFERENCES \`sep490_ftop\`.\`store\`(\`storeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
