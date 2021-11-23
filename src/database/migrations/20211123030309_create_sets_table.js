
exports.up = function (knex) {
    return knex.schema.createTable('sets', (table) => {
        table.increments('id').primary()
        table.string('setTitle').notNull()
        table.string('setDescription')
        table.integer('setPortion').unsigned()

        table.integer('user_id').unsigned().unique().notNull()
        table.foreign('user_id').references('users.id')

        table.timestamps(false, true)
    })
};

exports.down = function (knex) {

};
