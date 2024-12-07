import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1733145434856 implements MigrationInterface {
    name = 'UpdateDatabase1733145434856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`voucherId\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`walletBalance\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`walletBalance\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`status\` \`status\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`orderId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`productId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`status\` \`status\` tinyint(1) NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`walletBalance\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`walletBalance\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`voucherId\` int NOT NULL`);
    }

}
