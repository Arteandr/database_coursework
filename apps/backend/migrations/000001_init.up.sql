create domain year as integer
  check (
        value > 0
      and value < 2024
    );

CREATE TABLE districts
(
  id   serial primary key not null unique,
  name varchar(255)       not null unique
);

insert into districts (name)
values ('Кировский');
insert into districts (name)
values ('Ленинский');
insert into districts (name)
values ('Советский');
insert into districts (name)
values ('Куйбышевский');
insert into districts (name)
values ('Восточный');
insert into districts (name)
values ('Центральный');
insert into districts (name)
values ('Абрикосовый');
insert into districts (name)
values ('Железнодорожный');
insert into districts (name)
values ('Южный');
insert into districts (name)
values ('Автозаводской');

create table cinema_types
(
  id   serial primary key not null unique,
  name varchar(255)       not null unique
);

insert into cinema_types (name)
values ('Мультиплекс');
insert into cinema_types (name)
values ('Артхаус');
insert into cinema_types (name)
values ('Драйв-ин');
insert into cinema_types (name)
values ('IMAX');
insert into cinema_types (name)
values ('3D');
insert into cinema_types (name)
values ('Бутик');
insert into cinema_types (name)
values ('Уличный');
insert into cinema_types (name)
values ('Однозальный');
insert into cinema_types (name)
values ('Фестивальный');
insert into cinema_types (name)
values ('4D');

create table directors
(
  id        serial primary key not null unique,
  firstName varchar(255)       not null,
  lastName  varchar(255)       not null
);


insert into directors (firstName, lastName)
values ('Сергей', 'Герасимов');
insert into directors (firstName, lastName)
values ('Артемий', 'Демидов');
insert into directors (firstName, lastName)
values ('Дмитрий', 'Петров');
insert into directors (firstName, lastName)
values ('Артём', 'Павлов');
insert into directors (firstName, lastName)
values ('Филипп', 'Носов');
insert into directors (firstName, lastName)
values ('Иван', 'Попов');
insert into directors (firstName, lastName)
values ('Андрей', 'Носов');
insert into directors (firstName, lastName)
values ('Максим', 'Дмитриев');
insert into directors (firstName, lastName)
values ('Леонид', 'Щукин');
insert into directors (firstName, lastName)
values ('Егор', 'Терехов');

create table film_qualities
(
  id   serial primary key not null unique,
  name varchar(255)       not null unique
);

insert into film_qualities(name)
values ('отличное');
insert into film_qualities(name)
values ('хорошее');
insert into film_qualities(name)
values ('удовлетворительное');

create table countries
(
  id   serial primary key not null unique,
  name varchar(255)       not null unique
);

insert into countries (name)
values ('Россия');
insert into countries (name)
values ('Украина');
insert into countries (name)
values ('США');
insert into countries (name)
values ('Израиль');
insert into countries (name)
values ('Казахстан');
insert into countries (name)
values ('Норвегия');
insert into countries (name)
values ('Швеция');
insert into countries (name)
values ('ФРГ');
insert into countries (name)
values ('Италия');
insert into countries (name)
values ('Аргентина');

create table studios
(
  id           serial primary key                              not null unique,
  name         varchar(255)                                    not null unique,
  creationYear year                                            not null,
  countryId    int references countries (id) on delete cascade not null
);


create table films
(
  id           serial primary key                                   not null unique,
  name         varchar(255)                                         not null unique,
  description  varchar(255)                                         not null,
  photo        varchar(255)                                         not null,
  creationYear year                                                 not null,
  duration     int                                                  not null,
  directorId   int references directors (id) on delete cascade      not null,
  qualityId    int references film_qualities (id) on delete cascade not null,
  studioId     int references studios (id) on delete cascade        not null
);

