create table cinemas
(
  id         serial primary key               not null unique,
  name       varchar(255)                     not null unique,
  address    varchar(255)                     not null,
  phone      varchar(255)                     not null,
  license    varchar(255)                     not null,
  licenseEnd timestamp                        not null,
  seats      int                              not null,
  online     bool                             not null,
  typeId     int references cinema_types (id) not null,
  districtId int references districts (id)    not null
);

create table session_types
(
  id     serial primary key not null unique,
  name   varchar(255)       not null unique,
  ration decimal            not null
);

insert into session_types(name, ration)
values ('утренний', 0.6);
insert into session_types(name, ration)
values ('дневной', 1);
insert into session_types(name, ration)
values ('вечерний', 1.4);

create table sessions
(
  id            serial primary key                not null unique,
  date          timestamp                         not null,
  ticketsSold   int                               not null,
  ticketsOnline int                               not null,
  price         numeric(10, 2)                    not null,
  filmId        int references films (id)         not null,
  cinemaId      int references cinemas (id)       not null,
  typeId        int references session_types (id) not null
);

create index idx_films_directorId on films (directorid);
create index idx_films_name on films (name);


-- ПЕРВЫЙ ТРИГГЕР для FILMS
create or replace function set_films_id()
  returns trigger as
$$
begin
  NEW.id = nextval('films_id_seq');
  return NEW;
end;
$$ language plpgsql;

create trigger before_insert_films_id
  before insert
  on films
  for each row
execute function set_films_id();

-- ВТОРОЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION after_insert_films()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action after insert (e.g., logging) here.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_films
  AFTER INSERT
  ON films
  FOR EACH ROW
EXECUTE FUNCTION after_insert_films();

-- ТРЕТИЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION before_update_films()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action before update here.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_update_films
  BEFORE UPDATE
  ON films
  FOR EACH ROW
EXECUTE FUNCTION before_update_films();

-- ЧЕТВЕРТЫЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION before_delete_films()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action before delete here.
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_delete_cinemas
  BEFORE DELETE
  ON films
  FOR EACH ROW
EXECUTE FUNCTION before_delete_films();

-- ПЯТЫЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION after_update_films()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action after update (e.g., logging) here.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_update_cinemas
  AFTER UPDATE
  ON films
  FOR EACH ROW
EXECUTE FUNCTION after_update_films();

-- ШЕСТОЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION after_delete_films()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action after delete (e.g., logging) here.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_delete_films
  AFTER DELETE
  ON films
  FOR EACH ROW
EXECUTE FUNCTION after_delete_films();


-- ПЕРВЫЙ ТРИГГЕР для CINEMAS
create or replace function set_cinemas_id()
  returns trigger as
$$
begin
  NEW.id = nextval('cinemas_id_seq');
  return NEW;
end;
$$ language plpgsql;

create trigger before_insert_cinemas_id
  before insert
  on cinemas
  for each row
execute function set_cinemas_id();

-- ВТОРОЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION after_insert_cinemas()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action after insert (e.g., logging) here.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_films
  AFTER INSERT
  ON cinemas
  FOR EACH ROW
EXECUTE FUNCTION after_insert_cinemas();

-- ТРЕТИЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION before_update_cinemas()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action before update here.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_update_cinemas
  BEFORE UPDATE
  ON cinemas
  FOR EACH ROW
EXECUTE FUNCTION before_update_cinemas();

-- ЧЕТВЕРТЫЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION before_delete_cinemas()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action before delete here.
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_delete_cinemas
  BEFORE DELETE
  ON cinemas
  FOR EACH ROW
EXECUTE FUNCTION before_delete_cinemas();

-- ПЯТЫЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION after_update_cinemas()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action after update (e.g., logging) here.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_update_cinemas
  AFTER UPDATE
  ON cinemas
  FOR EACH ROW
EXECUTE FUNCTION after_update_cinemas();

-- ШЕСТОЙ ТРИГГЕР для FILMS
CREATE OR REPLACE FUNCTION after_delete_cinemas()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Your action after delete (e.g., logging) here.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_delete_cinemas
  AFTER DELETE
  ON cinemas
  FOR EACH ROW
EXECUTE FUNCTION after_delete_cinemas();
