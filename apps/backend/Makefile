migrate_up:
	migrate -path ./migrations -database 'postgres://postgres:12341234@localhost:5433/kurs?sslmode=disable' up
migrate_down:
	migrate -path ./migrations -database 'postgres://postgres:12341234@localhost:5433/kurs?sslmode=disable' down
migrate_new:
	migrate create -ext sql -dir ./migrations -seq $(name)
