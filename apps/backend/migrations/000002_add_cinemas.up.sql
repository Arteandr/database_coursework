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
