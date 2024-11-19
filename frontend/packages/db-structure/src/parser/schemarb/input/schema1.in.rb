create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
  t.uuid "company_id", null: false
  t.datetime "created_at", null: false
  t.string "name", default: "new user", null: true
  t.string "user_name", null: false
  t.index ["company_id"], name: "index_users_on_company_id"
end
