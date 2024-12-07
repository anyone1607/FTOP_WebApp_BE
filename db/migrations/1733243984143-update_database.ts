import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1733243984143 implements MigrationInterface {
    name = 'UpdateDatabase1733243984143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`status\` \`status\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`status\` \`status\` tinyint(1) NULL DEFAULT '1'`);
    }

}
