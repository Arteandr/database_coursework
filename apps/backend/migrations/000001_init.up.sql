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

create table cinema_types
(
  id   serial primary key not null unique,
  name varchar(255)       not null unique
);

create table directors
(
  id        serial primary key not null unique,
  firstName varchar(255)       not null unique,
  lastName  varchar(255)       not null unique
);

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

create table studios
(
  id           serial primary key            not null unique,
  name         varchar(255)                  not null unique,
  creationYear year                          not null,
  countryId    int references countries (id) not null
);


create table films
(
  id           serial primary key                 not null unique,
  name         varchar(255)                       not null unique,
  description  varchar(255)                       not null,
  photo        varchar(255)                       not null,
  creationYear year                               not null,
  duration     int                                not null,
  directorId   int references directors (id)      not null,
  qualityId    int references film_qualities (id) not null,
  studioId     int references studios (id)        not null
);

